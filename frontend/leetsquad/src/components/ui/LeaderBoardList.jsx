
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Medal, Crown } from "lucide-react";

export default function LeaderboardList({ data,username }) {
  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500">No data available yet.</div>;
  }

  return (
    
    <ul className="bg-white m-0 p-0">
      {data.slice(0, 10).map((user, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        const highlight = user.profilename === username;
        
        return (
          <li 
            key={index} 
            className={`group flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors duration-200 ${highlight ? 'bg-indigo-100' : ''}`}
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
                    <a href={`https://leetcode.com/u/${user.profilename}`} target="_blank" rel="noopener noreferrer">{user.profilename}</a>
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

function RankBadge({ rank }) {
  if (rank === 1) return <span className="flex justify-center"><Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" /></span>;
  if (rank === 2) return <span className="text-xl font-bold text-slate-400">#2</span>;
  if (rank === 3) return <span className="text-xl font-bold text-orange-400">#3</span>;
  return <span className="text-sm font-medium text-slate-400">#{rank}</span>;
}

function getMedalColor(rank) {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-transparent";
}