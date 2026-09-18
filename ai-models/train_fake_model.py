import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

print("1. Fake PG Dataset load ho raha hai...")
data = pd.read_csv('../dataset/fake_pg_data.csv')

# X = PG ki details, y = Fake hai ya nahi (1/0)
X = data[['rent', 'distance_to_miet', 'photos_count', 'amenities_count']]
y = data['is_fake']

print("2. Fraud Detection AI train ho raha hai...")
# Is baar hum Classifier use kar rahe hain kyunki answer Yes(1) ya No(0) me chahiye
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

print("3. Model save ho raha hai...")
with open('fake_detector.pkl', 'wb') as file:
    pickle.dump(model, file)

print("\n--- TEST ---")
# Ek ajeeb PG test karte hain: rent 1000, distance 1, photo 0, amenity 1
test_pg = pd.DataFrame([[1000, 1, 0, 1]], columns=['rent', 'distance_to_miet', 'photos_count', 'amenities_count'])
is_fake = model.predict(test_pg)[0]

if is_fake == 1:
    print("AI Warning: Ye PG FAKE lag raha hai! 🚨")
else:
    print("AI: Ye PG Asli (Safe) lag raha hai. ✅")