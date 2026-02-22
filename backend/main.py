from flask import Flask
from flask_cors import CORS
from api.test import api_bp
from supabase import create_client
import os
import dotenv
import requests
from flask import request, jsonify
from datetime import datetime, timedelta


dotenv.load_dotenv()

app = Flask(__name__)
app.config["SUPABASE_URL"] = os.getenv("SUPABASE_URL")
app.config["SUPABASE_KEY"] = os.getenv("SUPABASE_KEY")
supabase_client = create_client(app.config["SUPABASE_URL"], app.config["SUPABASE_KEY"])
app.dbclient = supabase_client


CORS(
    app,
    origins=[
        "http://localhost:3000",
        "https://leetsquad.vercel.app",
        "http://localhost:5173",
    ],
    allow_headers=["Content-Type", "Authorization"],
)
app.register_blueprint(api_bp)


@app.route("/api/update_profile", methods=["POST"])
def update_profile():
    """Update user profile with LeetCode stats."""
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


@app.route("/api/getlatestsubmissions", methods=["GET"])
def get_latest_submissions():
    """Get latest  LeetCode submissions for 7 days."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = app.dbclient.auth.get_user(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    username = request.args.get("username")
    query = """
    query recentSubmissions($username: String!) {
  recentSubmissionList(username: $username) {
    timestamp
  }
}
"""
    variables = {"username": username}

    res = requests.post(
        "https://leetcode.com/graphql",
        json={"query": query, "variables": variables},
        headers={"Content-Type": "application/json"},
    )

    today = datetime.now().date()
    submissions = res.json()["data"]["recentSubmissionList"]
    days = [today - timedelta(days=i) for i in range(1, 8)]

    counts = {day: 0 for day in days}

    for s in submissions:

        date = datetime.fromtimestamp(int(s["timestamp"])).date()
        if date in counts and counts[date] != 1:
            counts[date] = 1

    labels = [d.isoformat() for d in days]
    values = [counts[d] for d in days]
    return jsonify({"labels": labels, "values": values}), 200


@app.route("/api/get_leetcode_ranks", methods=["GET"])
def get_leetcode_ranks():
    """Get LeetCode ranks of all users."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = app.dbclient.auth.get_user(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    print("Fetching LeetCode ranks from database")
    try:
        profiles = (
            app.dbclient.table("profiles")
            .select(
                "profilename, profileavatarurl, leetrank, easysolved, mediumsolved, hardsolved"
            )
            .limit(10)
            .execute()

        )
        data = profiles.data

        for p in data:
            p["score"] = (
                p["hardsolved"] * 5
                + p["mediumsolved"] * 3
                + p["easysolved"]
            )

        data.sort(key=lambda x: x["score"], reverse=True)

        return jsonify(data), 200
    except Exception as e:
        print("Error fetching profiles:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_group_leaderboard/<string:group_id>", methods=["GET"])
def get_group_leaderboard(group_id):
    """Get leaderboard for a specific group."""

   
    
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = app.dbclient.auth.get_user(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    

    

    try:
        group = (
            app.dbclient.table("groups")
            .select("id")
            .eq("id",group_id)
            .single()
            .execute()
        )

        if not group.data:
            return jsonify({"error": "Group not found"}), 404

        members = (
            app.dbclient.table("group_members")
            .select("user_id")
            .eq("group_id", group.data["id"])
            .execute()
        )
         
        user_ids = [member["user_id"] for member in members.data]

        if not user_ids:
            return jsonify([]), 200

        profiles = (
            app.dbclient.table("profiles")
            .select(
                "profilename, profileavatarurl, leetrank, easysolved, mediumsolved, hardsolved"
            )
            .in_("profileid", user_ids)
            .execute()
        )


        data = profiles.data

        for p in data:
            p["score"] = (
                p["hardsolved"] * 5
                + p["mediumsolved"] * 3
                + p["easysolved"]
            )

        data.sort(key=lambda x: x["score"], reverse=True)
        return jsonify(data), 200
    except Exception as e:
        print("Error fetching group leaderboard:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_user_profile", methods=["GET"])
def get_user_profile():
    """Get LeetCode profile of a specific user."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = app.dbclient.auth.get_user(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    username = request.args.get("username")

    print("Fetching user stats for username from database:", username)
    try:
        profile = (
            app.dbclient.table("profiles")
            .select(
                "profilename, profileavatarurl, leetrank, easysolved, mediumsolved, hardsolved"
            )
            .eq("profilename", username)
            .single()
            .execute()
        )
        return jsonify(profile.data), 200
    except Exception as e:
        print("Error fetching user profile:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
