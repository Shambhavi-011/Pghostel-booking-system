from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load everything once when server starts
try:
    model = pickle.load(open('recommender.pkl', 'rb'))
    scaler = pickle.load(open('scaler.pkl', 'rb'))
    data = pd.read_csv('../dataset/pg_catalog.csv')
except Exception as e:
    print("Error loading models or dataset:", e)

@app.route('/recommend-pg', methods=['POST'])
def recommend_pg():
    try:
        req_data = request.json
        
        # User ki preferences nikalna
        user_pref = pd.DataFrame([[
            req_data.get('rent', 5000), 
            req_data.get('distance_to_miet', 2), 
            req_data.get('sharing_type', 2), 
            req_data.get('has_ac', 0)
        ]], columns=['rent', 'distance_to_miet', 'sharing_type', 'has_ac'])
        
        # Data scale karna
        pref_scaled = scaler.transform(user_pref)
        
        # KNN se prediction (distance aur index)
        distances, indices = model.kneighbors(pref_scaled)
        
        recommended_pgs = []
        for i, dist in zip(indices[0], distances[0]):
            pg = data.iloc[i]
            # Match Percentage calculate karna (0 distance = 100% match)
            match_percentage = round(max(0, (1 - dist)) * 100) 
            
            recommended_pgs.append({
                "pgId": int(pg['id']) if 'id' in pg else int(i),
                "pgName": str(pg['pg_name']),
                "rent": int(pg['rent']),
                "distance": float(pg['distance_to_miet']),
                "matchPercentage": f"{match_percentage}%"
            })
            
        return jsonify({
            "status": "success",
            "recommendations": recommended_pgs
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Server port 8000 par chalega, jahan Java requests bhej raha hai
    app.run(port=8000, debug=True)