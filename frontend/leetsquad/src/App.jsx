import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Home from "./Home";
import Navbar from "./components/NavBar.jsx";
import { Routes, Route } from "react-router-dom";
import GroupCreatorMenu from './Group.jsx'

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userprofiledata, setUserProfileData] = useState(null);
  const fetchedUserProfile = useRef(null);



  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);


    useEffect(() => {
    if (!session) {
      return;
    }
    if (fetchedUserProfile.current === session.user.id) {
      console.log("User profile already fetched");
      return;
    }

    fetchedUserProfile.current = session.user.id;

    const fetchUserProfile = async () => {
      try {
        let username = session.user.user_metadata.leetcodename;
        const response = await fetch(
          "https://leetsq.vercel.app/api/get_user_profile?username=" + username,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );
        const userprofile = await response.json();
        setUserProfileData(userprofile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar session={session} profileimage={userprofiledata?.profileavatarurl} />


     <Routes>
        <Route path='/groups' element={!session ? <Auth session={session} /> : <GroupCreatorMenu />} />

        <Route path="/" element={!session ? <Auth session={session} /> :  <Home session={session} userprofile={userprofiledata} />}/>
      </Routes>
      

    </>
  
  );
}

export default App;
