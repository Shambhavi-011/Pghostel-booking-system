import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

print("1. Dataset load ho raha hai...")
# Dataset ko read karo
data = pd.read_csv('../dataset/pg_data.csv')

# Features (X) aur Target (y) set karo
# X = PG ki details, y = Rent jo hume predict karna hai
X = data[['sharing_type', 'has_ac', 'has_wifi', 'has_food', 'distance_to_miet']]
y = data['rent']

print("2. AI Model train ho raha hai...")
# Random Forest model banayenge (jaisa research paper me suggested hai)
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Model ko data se sikhate hain
model.fit(X, y)

print("3. Model train ho gaya! Isey save kar rahe hain...")
# Train kiye hue model ko save kar lete hain taaki baad me Java isko use kar sake
with open('price_predictor.pkl', 'wb') as file:
    pickle.dump(model, file)

print("\n--- TEST Karke Dekhte Hain ---")
# Ek dummy PG ki details daalte hain: Double sharing(2), AC(1), WiFi(1), Food(1), Distance(2km)
test_pg = pd.DataFrame([[2, 1, 1, 1, 2]], columns=['sharing_type', 'has_ac', 'has_wifi', 'has_food', 'distance_to_miet'])
predicted_rent = model.predict(test_pg)

print(f"Is nayi PG ka predicted rent hona chahiye: ₹{predicted_rent[0]:.2f}")