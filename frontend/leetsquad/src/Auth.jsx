import { useState } from "react";
import { supabase } from "./supabaseClient";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {

  async function updateProfile(leetcodename) {

    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user.id;

    const reponse = await fetch("http://localhost:3000/api/update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        leetcodename: leetcodename,
      }),
    });
    const data = await reponse.json();
    if (data.error) {
      alert(data.error);
    }
  }
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leetcodename, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { data,error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { leetcodename } },
    });

    if (error) {
      alert(error.message);
    }
    else if(data.user){
      // instrcut user to verify email
    
      updateProfile(leetcodename);
    }
    setLoading(false);

  };

  return (
    <div className="w-full max-w-md flex flex-col p-8 rounded-md shadow-md bg-auto mt-20">
      <div className="title flex flex-col items-center mb-6">

      <h2 className="font-bold text-2xl">Welcome to LeetSquad</h2>
      </div>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="text"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="leetcodeusername">
              Leetcode Username
              
            </FieldLabel>
            <Input
              id="leetcodeusername"
              type="text"
              placeholder="leetcodemaster123"
              value={leetcodename}
              onChange={(e) => setName(e.target.value)}
            />
            <FieldDescription>
              Enter your Leetcode username to link your account
            </FieldDescription>
          </Field>

          <Button className="mt-4" onClick={handleSignUp} disabled={loading}>
            Create Account
          </Button>
          <Button variant="secondary" className="mt-4" onClick={handleLogin} disabled={loading}>
            Sign In
          </Button>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
