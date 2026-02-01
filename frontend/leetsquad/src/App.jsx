import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

import { AppLayout } from "./components/layout/AppLayout";
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasUpdatedProfile = useRef(false);

  async function updateProfile(currentSession) {
    if (!currentSession) {
      console.log("No currentSession found");
      return;
    } else {
      console.log("Session found:", currentSession);
    }

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
    if (result.error) {
      alert(result.error);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Initial session:", session);
      setLoading(false);
    });

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        console.log("Auth event:", event);
        if (event === "SIGNED_IN") {
          setSession(session);
          setLoading(false);
          if (!hasUpdatedProfile.current) {
            updateProfile(session);
            hasUpdatedProfile.current = true;
          }
        }

        if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setSession(null);
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AppLayout>
      {!session ? <Auth session={session} /> : <Dashboard session={session} />}
    </AppLayout>
  );
}

export default App;
