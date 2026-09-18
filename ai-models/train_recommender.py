import pandas as pd
from sklearn.neighbors import NearestNeighbors
import pickle

print("1. PG Catalog load ho raha hai...")
data = pd.read_csv('../dataset/pg_catalog.csv')

# Recommendation ke liye hum sirf in 4 features ko match karenge
features = data[['rent', 'distance_to_miet', 'sharing_type', 'has_ac']]

print("2. Recommendation AI train ho raha hai (KNN Algorithm)...")
# n_neighbors=3 ka matlab hai ye top 3 best PGs nikaal kar dega
model = NearestNeighbors(n_neighbors=3, algorithm='auto')
model.fit(features)

print("3. Model save ho raha hai...")
with open('recommender.pkl', 'wb') as file:
    pickle.dump(model, file)

print("\n--- TEST RECOMMENDATION ---")
# Maan lo ek user aaya jisko chahiye: Rent=7000, Distance=2km, Double Sharing(2), AC(1)
user_preference = pd.DataFrame([[7000, 2, 2, 1]], columns=['rent', 'distance_to_miet', 'sharing_type', 'has_ac'])

# AI se puchte hain sabse best match
distances, indices = model.kneighbors(user_preference)

print("AI: User ki pasand ke hisaab se ye top 3 PGs hain:")
for i in indices[0]:
    pg = data.iloc[i]
    print(f"- {pg['pg_name']} (Rent: ₹{pg['rent']}, Distance: {pg['distance_to_miet']}km)")