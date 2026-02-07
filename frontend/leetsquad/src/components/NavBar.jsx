import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Home } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Navbar({ session, profileimage }) {
  return (
    <nav className="flex bg-purple-400 justify-evenly">

      <div className="w-full px-4 py-3 flex justify-between items-center">
        {session &&   (<div className="font-semibold flex gap-2 items-center text-white">
          {" "}
          <Avatar className={`h-14 w-14 border-2 border-transparent`}>
            <AvatarImage src={profileimage} alt={session.l} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
              {session.user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {session && session.user.email.replace(/@.*$/, "")}
        </div>)}

      

        <Link to="/" className="text-white text-lg font-semibold">
          <Home></Home>
        </Link>


                  {session && (
          <Link
            to="/groups"
            className="text-white text-lg font-bold ml-4"
          >
            Groups
          </Link>
        )}

        {session && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-white font-semibold ml-4"
          >
            Sign Out
          </button>
        )}

   

        {!session && (
          <Link to="/" className="text-white text-lg font-semibold">
            <User/>
          </Link>
        )}

   
        
      </div>
    </nav>
  );
}

export default Navbar;
