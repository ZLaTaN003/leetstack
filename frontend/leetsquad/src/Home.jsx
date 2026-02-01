import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react"; 

export default function Home({ session }) {
  const hasUpdatedProfile = useRef(false);
  const hasUpdatedLeaderboard = useRef(false);
  
  const [gldata, setGldata] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state for better UX

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
      hasUpdatedProfile.current = false;
      return;
    }
    if (!hasUpdatedProfile.current) {
      updateProfile(session);
      hasUpdatedProfile.current = true;
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      hasUpdatedLeaderboard.current = false;
      return;
    }

    if (hasUpdatedLeaderboard.current) return;

    hasUpdatedLeaderboard.current = true;
    
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_leetcode_ranks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });
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

  if (!session) return <div className="p-10 text-center">Please log in to view the leaderboard.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">

     
        
        <div className="text-center space-y-2 flex justify-center flex-col mb-8 align-middle">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            LeetCode Leaderboard
          </h2>
         
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex justify-start flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Current Standings
            </h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {gldata.length} Participants
            </span>
          </div>

          <div className=" divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading rankings...</div>
            ) : (
              <LeaderboardList data={gldata} />
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}

// Separated Component for cleaner code
function LeaderboardList({ data }) {
  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500">No data available yet.</div>;
  }

  return (
    
    <ul className="bg-white">
      {data.map((user, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        
        return (
          <li 
            key={index} 
            className="group flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">

              <div className="shrink-0 w-8 text-center">
                <RankBadge rank={rank} />
              </div>

              <div className="flex items-center gap-3">
                <Avatar className={`h-14 w-14 border-2 ${isTop3 ? 'border-indigo-100' : 'border-transparent'}`}>
                  <AvatarImage src={user.profileavatarurl} alt={user.profilename} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                    {user.profilename?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${isTop3 ? 'text-slate-900' : 'text-slate-700'}`}>
                    {user.profilename}
                  </span>
                </div>
              </div>
            </div>

            {isTop3 && (
              <div className="hidden sm:block">
                 <Medal className={`w-5 h-5 ${getMedalColor(rank)} opacity-80`} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Helper component to style the rank numbers
function RankBadge({ rank }) {
  if (rank === 1) return <span className="flex justify-center"><Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" /></span>;
  if (rank === 2) return <span className="text-xl font-bold text-slate-400">#2</span>;
  if (rank === 3) return <span className="text-xl font-bold text-orange-400">#3</span>;
  return <span className="text-sm font-medium text-slate-400">#{rank}</span>;
}

// Helper for medal colors
function getMedalColor(rank) {
  switch (rank) {
    case 1: return "text-yellow-500";
    case 2: return "text-slate-400";
    case 3: return "text-orange-400";
    default: return "text-slate-200";
  }
}