from flask import Blueprint, jsonify
import requests

api_bp = Blueprint("api", __name__)


@api_bp.get("/api/data")
def get_sample_data():
    return "potta"


leetcode_username = "zlatan003"
response = requests.get(f"https://leetcode-stats-api.herokuapp.com/{leetcode_username}")
if response.status_code == 200:
    data = response.json()
    print(data)