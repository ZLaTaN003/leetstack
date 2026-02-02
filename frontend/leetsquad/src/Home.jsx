import { useRef, useEffect, useState, use } from "react";
import { Trophy } from "lucide-react";
import LeaderboardList from "@/components/ui/LeaderBoardList";
import { ChartPieSimple } from "@/components/ui/PieChart";
import { ChartLineDefault } from "@/components/ui/LineChart";

export default function Home({ session,userprofile }) {


  const [gldata, setGldata] = useState([]);
  const [loading, setLoading] = useState(true);

    const updatedLeaderboardUser = useRef(null);
  const updatedProfileUser = useRef(null);

  async function updateProfile(currentSession) {
    if (!currentSession) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/update_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        body: JSON.stringify({
          leetcodename: currentSession.user.user_metadata.leetcodename,
        }),
      });
      const result = await response.json();
      if (result.error) console.error(result.error);
    } catch (e) {
      console.error("Profile update failed", e);
    }
  }

  useEffect(() => {
    if (!session) {
      return;
    }
    if (updatedProfileUser.current !== session.user.id) {
      updateProfile(session);
      updatedProfileUser.current = session.user.id;
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (updatedLeaderboardUser.current === session.user.id) {
      console.log("Leaderboard already updated");
      return;
    }

    updatedLeaderboardUser.current = session.user.id;

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/get_leetcode_ranks",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );
        const data = await response.json();
        setGldata(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [session]);



  if (!session)
    return (
      <div className="p-10 text-center">
        Please log in to view the leaderboard.
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 w-full flex lg:flex-row flex-col items-center gap-20 bg-red-50 justify-center">
      <div className="max-w-3xl w-full h-full">
        <div className=" min-h-100 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex justify-start flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Current Standings
            </h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {gldata.length} Participants
            </span>
          </div>

          <div className="">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                Loading rankings...
              </div>
            ) : (
              <LeaderboardList data={gldata} username={session.user.user_metadata.leetcodename} />
            )}
          </div>
        </div>
      </div>

      <div className="visuals flex flex-col lg:w-2xl ">
        <div className="linechart w-full mb-8 ">
          <ChartLineDefault session={session} />
        </div>
        <div className="piechart">
          <ChartPieSimple
            chartData={[
              { difficulty: "Easy", solved: userprofile?.easysolved || 0, fill: "var(--color-easy)" },
              {
                difficulty: "Medium",
                solved: userprofile?.mediumsolved || 0,
                fill: "var(--color-medium)",
              },
              { difficulty: "Hard", solved: userprofile?.hardsolved || 0, fill: "var(--color-hard)" },
            ]}
            totalsolved={userprofile?.easysolved + userprofile?.mediumsolved + userprofile?.hardsolved}
          />
        </div>
      </div>
    </div>
  );
}
