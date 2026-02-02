from flask import Blueprint, jsonify
import requests

api_bp = Blueprint("api", __name__)


@api_bp.get("/api/data")
def get_sample_data():
    return "potta"




