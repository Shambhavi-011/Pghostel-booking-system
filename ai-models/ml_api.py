from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd

app = FastAPI()

# --- MODELS LOAD KARNA ---
with open('price_predictor.pkl', 'rb') as file:
    price_model = pickle.load(file)

with open('fake_detector.pkl', 'rb') as file:
    fake_model = pickle.load(file)

with open('recommender.pkl', 'rb') as file:
    recommender_model = pickle.load(file)

# PG catalog ko read karke memory me rakhte hain taaki naam bata sakein
pg_catalog = pd.read_csv('../dataset/pg_catalog.csv')


# --- DATA FORMATS ---
class PriceDetails(BaseModel):
    sharing_type: int
    has_ac: int
    has_wifi: int
    has_food: int
    distance_to_miet: int

class FakeCheckDetails(BaseModel):
    rent: float
    distance_to_miet: int
    photos_count: int
    amenities_count: int

class UserPreferences(BaseModel):
    rent: float
    distance_to_miet: int
    sharing_type: int
    has_ac: int


# --- API ENDPOINTS ---
@app.post("/predict-price")
def predict_rent(details: PriceDetails):
    input_data = pd.DataFrame([[details.sharing_type, details.has_ac, details.has_wifi, details.has_food, details.distance_to_miet]], columns=['sharing_type', 'has_ac', 'has_wifi', 'has_food', 'distance_to_miet'])
    return {"suggested_price": round(price_model.predict(input_data)[0], 2)}

@app.post("/check-fake")
def check_fake_listing(details: FakeCheckDetails):
    input_data = pd.DataFrame([[details.rent, details.distance_to_miet, details.photos_count, details.amenities_count]], columns=['rent', 'distance_to_miet', 'photos_count', 'amenities_count'])
    is_fake = fake_model.predict(input_data)[0]
    return {"status": "FAKE" if is_fake == 1 else "REAL"}

# --- NAYA ENDPOINT: RECOMMENDATION ---
@app.post("/recommend-pg")
def recommend_pg(prefs: UserPreferences):
    input_data = pd.DataFrame([[prefs.rent, prefs.distance_to_miet, prefs.sharing_type, prefs.has_ac]], columns=['rent', 'distance_to_miet', 'sharing_type', 'has_ac'])
    
    distances, indices = recommender_model.kneighbors(input_data)
    
    recommendations = []
    for i in indices[0]:
        pg = pg_catalog.iloc[i]
        recommendations.append({
            "pg_id": int(pg['pg_id']),
            "name": str(pg['pg_name']),
            "rent": float(pg['rent']),
            "distance": float(pg['distance_to_miet'])
        })
        
    return {"top_recommendations": recommendations}