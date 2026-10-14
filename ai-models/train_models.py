import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
import pickle

# 1. rent Predictor (bed_sharing, ac, wifi, meal)
X_rent = np.array([[1, 1, 1, 1], [2, 0, 1, 0], [1, 0, 0, 0], [3, 1, 0, 1]])
y_rent = np.array([8000, 4000, 3000, 5000])
rent_model = LinearRegression().fit(X_rent, y_rent)

with open('rent_predictor.pkl', 'wb') as f:
    pickle.dump(rent_model, f)

# 2. Fake Detector (rent, photos_count, amenities_count)
X_fake = np.array([[3000, 5, 4], [1000, 0, 1], [8000, 10, 8], [500, 0, 0]])
y_fake = np.array([0, 1, 0, 1]) # 0=Real, 1=Fake
fake_model = RandomForestClassifier().fit(X_fake, y_fake)

with open('fake_detector.pkl', 'wb') as f:
    pickle.dump(fake_model, f)

# 3. Recommender (rent, bed_sharing, ac)
X_rec = np.array([[7000, 1, 1], [3500, 1, 0], [4500, 2, 0], [2500, 3, 0], [3000, 1, 0]])
rec_model = NearestNeighbors(n_neighbors=3).fit(X_rec)

with open('recommender.pkl', 'wb') as f:
    pickle.dump(rec_model, f)

print("Saare naye AI models successfully train aur save ho gaye hain!")