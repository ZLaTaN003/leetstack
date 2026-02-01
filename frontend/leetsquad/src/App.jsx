import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Home from "./Home";
import { AppLayout } from "./components/layout/AppLayout";
import Navbar from './components/NavBar.jsx'
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Initial session:", session);
      setLoading(false);
    });

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setLoading(false);

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
          <Navbar session={session} />

      {!session ? <Auth session={session} /> : <Home session={session} />}
    </AppLayout>
  );
}

export default App;
