from flask import Flask
from flask_cors import CORS
from api.test import api_bp
from supabase import create_client
import os
import dotenv
import requests
from flask import request, jsonify

dotenv.load_dotenv()

app = Flask(__name__)
app.config["SUPABASE_URL"] = os.getenv("SUPABASE_URL")
app.config["SUPABASE_KEY"] = os.getenv("SUPABASE_KEY")
supabase_client = create_client(app.config["SUPABASE_URL"], app.config["SUPABASE_KEY"])
app.dbclient = supabase_client


CORS(app,origins=["http://localhost:3001","http://localhost:5173","http://localhost:3000"])
app.register_blueprint(api_bp)


@app.route("/api/update_profile", methods=["POST"])
def update_profile():
    
    data = request.json
    leetcodename = data.get("leetcodename")
    user_id = data.get("user_id")

    response = requests.get(f"https://leetcode-stats-api.herokuapp.com/{leetcodename}")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from LeetCode API."}), 500
    
    leetcode_data = response.json()


    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        response = app.dbclient.table("profiles").upsert(
            {
                "profileid": user_id,
                "profilename": leetcodename,
                "profileavatarurl": f"https://api.dicebear.com/9.x/dylan/svg?seed={leetcodename}",
                "leetrank": leetcode_data.get("ranking"),
                "acceptancerate": leetcode_data.get("acceptanceRate"),
                "easysolved": leetcode_data.get("easySolved"),
                "mediumsolved": leetcode_data.get("mediumSolved"),
                "hardsolved": leetcode_data.get("hardSolved"),
                


            }
        ).execute()

        return jsonify({"message": "Profile updated successfully.", "data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500