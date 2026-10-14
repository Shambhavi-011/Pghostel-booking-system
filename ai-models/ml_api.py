from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, AliasChoices
import pickle
import pandas as pd
from pathlib import Path
from typing import Any, Dict, List, Optional
from sklearn.neighbors import NearestNeighbors

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = Path(__file__).resolve().parent

with (MODEL_DIR / 'price_predictor.pkl').open('rb') as file:
    price_model = pickle.load(file)

with (MODEL_DIR / 'fake_detector.pkl').open('rb') as file:
    fake_model = pickle.load(file)

class rentDetails(BaseModel):
    bed_sharing: int
    ac: int
    wifi: int
    meal: int

class FakeCheckDetails(BaseModel):
    price: float = Field(validation_alias=AliasChoices('price', 'rent'))
    photos_count: int
    amenities_count: int

class UserPreferences(BaseModel):
    max_price: Optional[float] = None
    price: Optional[float] = None
    rent: Optional[float] = None
    bed_sharing: Optional[int] = None
    sharing_type: Optional[int] = None
    ac: int = 0
    has_ac: Optional[int] = None
    wifi: int = 0
    meal: int = 0
    mess: Optional[int] = None
    laundry: int = 0
    city: str = ''
    area: str = ''
    properties: List[Dict[str, Any]] = Field(default_factory=list)


# --- API ENDPOINTS ---
@app.post("/predict-rent")
def predict_rent(details: rentDetails):
    # Naye features ke sath dataframe banaya
    input_data = pd.DataFrame([[details.bed_sharing, details.ac, details.wifi, details.meal]],
                              columns=['bed_sharing', 'ac', 'wifi', 'meal'])
    return {"suggested_rent": round(price_model.predict(input_data)[0], 2)}

@app.post("/check-fake")
def check_fake_listing(details: FakeCheckDetails):
    input_data = pd.DataFrame([[details.price, details.photos_count, details.amenities_count]],
                              columns=['rent', 'photos_count', 'amenities_count'])
    is_fake = fake_model.predict(input_data)[0]
    return {"status": "FAKE" if is_fake == 1 else "REAL"}

def _number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _binary(value):
    if isinstance(value, bool):
        return float(value)
    if isinstance(value, (int, float)):
        return 1.0 if value > 0 else 0.0
    normalized = str(value or '').strip().lower()
    if normalized in {'yes', 'true', 'available', 'included', '1'}:
        return 1.0
    if normalized in {'no', 'false', 'not available', 'not included', '0'}:
        return 0.0
    return 0.5


def _sharing_options(value):
    normalized = str(value or '').strip().lower()
    labels = {'single': 1, 'private': 1, 'twin': 2, 'double': 2, 'triple': 3, 'four': 4, 'quad': 4}
    options = [count for label, count in labels.items() if label in normalized]
    if not options:
        number = _number(value)
        if number is not None:
            options.append(int(number))
    return options


def _property_features(property_data, preference):
    max_price = preference.max_price or preference.price or preference.rent
    property_price = _number(property_data.get('price', property_data.get('rent')))
    price_feature = min(property_price / max_price, 1.5) if property_price is not None and max_price and max_price > 0 else 0.7

    requested_sharing = preference.bed_sharing or preference.sharing_type or 2
    available_sharing = _sharing_options(property_data.get('bedSharing', property_data.get('bed_sharing')))
    sharing_feature = (
        min(available_sharing, key=lambda value: abs(value - requested_sharing)) / 4
        if available_sharing else requested_sharing / 4
    )

    ac = preference.has_ac if preference.has_ac is not None else preference.ac
    meal = preference.mess if preference.mess is not None else preference.meal
    return [
        price_feature,
        sharing_feature,
        _binary(property_data.get('ac')),
        _binary(property_data.get('wifi')),
        _binary(property_data.get('meal', property_data.get('mealsIncluded', property_data.get('foodType')))),
        _binary(property_data.get('laundry')),
    ], [
        0.7,
        requested_sharing / 4,
        float(ac),
        float(preference.wifi),
        float(meal),
        float(preference.laundry),
    ]


@app.post("/recommend-pg")
def recommend_pg(prefs: UserPreferences):
    requested_city = prefs.city.strip().lower()
    requested_area = prefs.area.strip().lower()
    max_price = prefs.max_price or prefs.price or prefs.rent
    requested_sharing = prefs.bed_sharing or prefs.sharing_type
    eligible = []

    for property_data in prefs.properties:
        property_city = str(property_data.get('city') or '').strip().lower()
        property_area = ' '.join([
            str(property_data.get('locality') or ''),
            str(property_data.get('pgName') or property_data.get('pg_name') or ''),
        ]).lower()
        if requested_city and property_city != requested_city:
            continue
        if requested_area and requested_area not in property_area:
            continue
        property_price = _number(property_data.get('price', property_data.get('rent')))
        if max_price and property_price is not None and property_price > max_price:
            continue

        available_sharing = _sharing_options(property_data.get('bedSharing', property_data.get('bed_sharing')))
        if requested_sharing and available_sharing and requested_sharing not in available_sharing:
            continue
        eligible.append(property_data)

    if not eligible:
        return {"status": "success", "recommendations": [], "top_recommendations": []}

    feature_rows = []
    for property_data in eligible:
        features, target = _property_features(property_data, prefs)
        feature_rows.append(features)

    neighbors = NearestNeighbors(n_neighbors=len(eligible), metric='euclidean')
    neighbors.fit(feature_rows)
    distances, indices = neighbors.kneighbors([target])
    recommendations = []
    for distance, index in zip(distances[0], indices[0]):
        recommended = dict(eligible[index])
        match = max(0.0, 1.0 - distance / (6 ** 0.5))
        recommended['matchPercentage'] = f"{round(match * 100)}%"
        recommendations.append(recommended)

    return {
        "status": "success",
        "recommendations": recommendations,
        "top_recommendations": recommendations,
    }