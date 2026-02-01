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


CORS(
    app,
    origins=["*"],
    allow_headers=["Content-Type", "Authorization"],

)
app.register_blueprint(api_bp)


@app.route("/api/update_profile", methods=["POST"])
def update_profile():
    query = """
    query getUserStats($username: String!) {
    matchedUser(username: $username) {
        profile { ranking }
        submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        }
    }
    }
    """

    data = request.json
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = app.dbclient.auth.get_user(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    leetcodename = data.get("leetcodename")
    payload = {"query": query, "variables": {"username": leetcodename}}

    user_id = user.user.id

    print("Making request to LeetCode API for:", leetcodename)

    response = requests.post(
        "https://leetcode.com/graphql",
        json=payload,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
        },
    )
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from LeetCode API."}), 500

    res = response.json()
    print("LeetCode API response:", res)

    try:
        response = (
            app.dbclient.table("profiles")
            .upsert(
                {
                    "profileid": user_id,
                    "profilename": leetcodename,
                    "profileavatarurl": f"https://api.dicebear.com/9.x/dylan/svg?seed={leetcodename}",
                    "leetrank": res["data"]["matchedUser"]["profile"]["ranking"],
                    "easysolved": res["data"]["matchedUser"]["submitStatsGlobal"][
                        "acSubmissionNum"
                    ][1]["count"],
                    "mediumsolved": res["data"]["matchedUser"]["submitStatsGlobal"][
                        "acSubmissionNum"
                    ][2]["count"],
                    "hardsolved": res["data"]["matchedUser"]["submitStatsGlobal"][
                        "acSubmissionNum"
                    ][3]["count"],
                }
            )
            .execute()
        )

        return (
            jsonify({"message": "Profile updated successfully."}),
            200,
        )
    except Exception as e:
        print("Error updating profile:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)