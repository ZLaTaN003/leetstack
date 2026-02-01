import { Link } from "react-router-dom";
import { User } from "lucide-react";
import {Home} from "lucide-react"
import { supabase } from "../supabaseClient";

function Navbar({session}) {
  return (
    <nav className="flex bg-purple-400 justify-evenly">
        
        <div className= "w-full px-4 py-3 flex justify-between items-center">  
    <div className="font-semibold flex gap-2 items-center text-white"> <User></User>{session && session.user.email.replace(/@.*$/, '')}</div>

            <Link to="/" className="text-white text-lg font-semibold">
                <Home></Home>
            </Link>

     



               {session && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-white font-semibold ml-4"
          >
            Sign Out
          </button>
        )}

        </div>
    </nav>
  );
}

export default Navbar;
