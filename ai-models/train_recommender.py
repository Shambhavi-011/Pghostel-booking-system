import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
import pickle

print("1. PG Catalog load ho raha hai...")
data = pd.read_csv('../dataset/pg_catalog.csv')

features = data[['rent', 'distance_to_miet', 'sharing_type', 'has_ac']]

print("2. Data Scale ho raha hai (Taaki Rent aur AC ko equal weight mile)...")
scaler = MinMaxScaler()
features_scaled = scaler.fit_transform(features)

print("3. Recommendation AI train ho raha hai (KNN Algorithm)...")
model = NearestNeighbors(n_neighbors=3, algorithm='auto')
model.fit(features_scaled)

print("4. Model aur Scaler save ho rahe hain...")
with open('recommender.pkl', 'wb') as file:
    pickle.dump(model, file)
with open('scaler.pkl', 'wb') as file:
    pickle.dump(scaler, file)

print("\n--- TEST RECOMMENDATION ---")
user_preference = pd.DataFrame([[7000, 2, 2, 1]], columns=['rent', 'distance_to_miet', 'sharing_type', 'has_ac'])
user_pref_scaled = scaler.transform(user_preference)

distances, indices = model.kneighbors(user_pref_scaled)

print("AI: User ki pasand ke hisaab se ye top 3 PGs hain:")
for i in indices[0]:
    pg = data.iloc[i]
    print(f"- {pg['pg_name']} (Rent: ₹{pg['rent']}, Distance: {pg['distance_to_miet']}km)")