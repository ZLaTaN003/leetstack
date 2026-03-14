import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Trophy } from "lucide-react";
import { supabase } from "./supabaseClient";
import LeaderboardList from "@/components/ui/LeaderBoardList";
import { Users } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Chat({ session }) {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboardloading, setLeaderboardLoading] = useState(false);

  const [groups, setGroups] = useState([]);
  const [groupLeaderboard, setGroupLeaderboard] = useState([]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, groups ( id, name )")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching groups:", error);
        return;
      }

      if (!data) return;
      console.log("Fetched groups:", data);
      const formattedGroups = data.map((item, index) => ({
        id: item.group_id,
        pos: index + 1,
        name: item.groups.name,
      }));

      setGroups(formattedGroups);

      setActiveGroupId(formattedGroups[0].id);
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!session || !activeGroupId) {
      console.log("Session or activeGroupId not set yet", activeGroupId);
      return;
    }

    setLeaderboardLoading(true);

    const fetchGroupLeaderboard = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_group_leaderboard/${activeGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          },
        );

        const data = await response.json();
        setGroupLeaderboard(data);
        console.log("Fetched group leaderboard:", data);
      } catch (error) {
        console.error("Error fetching group leaderboard:", error);
      }

      setLeaderboardLoading(false);
    };

    fetchGroupLeaderboard();
  }, [activeGroupId]);

  useEffect(() => {
    if (!activeGroupId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
        id,
        content,
        created_at,
        sender_id,
        profiles ( profilename,profileavatarurl )
      `,
        )
        .eq("group_id", activeGroupId)
        .order("created_at", { ascending: true });

      console.log("Fetched messages for group", activeGroupId, data);

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data);
    };

    fetchMessages();
  }, [activeGroupId]);

  useEffect(() => {
    if (!activeGroupId) return;

    const channel = supabase
      .channel("group-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${activeGroupId}`,
        },
        async (payload) => {
          // Fetch sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("profilename")
            .eq("profileid", payload.new.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              ...payload.new,
              profiles: profile,
            },
          ]);
        },
      )
      .subscribe();

    console.log("Subscribed to real-time messages for group:", activeGroupId);
    console.log("Current messages:", messages);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeGroupId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        content: inputText,
        group_id: activeGroupId,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setInputText("");
  };

  const handleCreateGroup = async () => {
    const name = prompt("Enter group name:");
    if (!name) return;
    setLoading(true);
    const { data: groupdata, error } = await supabase
      .from("groups")
      .insert([
        {
          name: name,
          join_key: `${name.toLowerCase().replace(/\s+/g, "-")}`,
        },
      ])
      .select()
      .single();
    if (error) {
      alert("Error creating group: " + error.message);
      setLoading(false);
      return;
    }

    console.log("Group created:", groupdata);

    const { error: memberError } = await supabase.from("group_members").insert([
      {
        group_id: groupdata.id,
        user_id: session.user.id,
      },
    ]);
    console.log("Adding user to group:", {
      group_id: groupdata.id,
      user_id: session.user.id,
    });

    if (memberError) {
      alert("Error adding user to group: " + memberError.message);
      setLoading(false);
      return;
    }

    setGroups([
      ...groups,
      { id: groupdata.id, name: groupdata.name, pos: groups.length + 1 },
    ]);
    console.log("Created new group:", groups);
    setActiveGroupId(groupdata.id);
    setLoading(false);
  };

  const handleGroupJoin = async () => {
    const joinKey = prompt("Enter group name to join:");
    if (!joinKey) return;
    setLoading(true);
    const { data: groupdata, error } = await supabase
      .from("groups")
      .select()
      .eq("join_key", joinKey)
      .single();

    if (error) {
      alert("Error finding group: " + error.message);
      setLoading(false);
      return;
    }

    console.log("Group found:", groupdata);

    const { error: memberError } = await supabase.from("group_members").insert([
      {
        group_id: groupdata.id,
        user_id: session.user.id,
      },
    ]);

    if (memberError) {
      alert("Error joining group: " + memberError.message);
      setLoading(false);
      return;
    }

    setGroups([
      ...groups,
      { id: groupdata.id, name: groupdata.name, pos: groups.length + 1 },
    ]);
    console.log("Joined group:", groups);
    setActiveGroupId(groupdata.id);
    setLoading(false);
  };

  console.log(groups, "thiis", activeGroupId);
  const activeGroupName =
    groups.find((g) => g.id === activeGroupId)?.name || "Unknown Group";

  // --- RENDER ---
  return (
    <>
      <div  className="flex flex-col md:flex-row h-screen font-sans bg-[#09090b] p-6">
        {/* LEFT SIDE: LEADERBOARD */}

        <div className="max-w-3xl w-full h-full mr-4">
          <div className=" min-h-100 bg-[#18181b] rounded-2xl shadow-xl overflow-hidden border border-[#27272a] flex justify-start flex-col">
            <div className="px-6 py-5 border-b  bg-[#27272a] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#fafafa] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Current Standings
              </h3>
              <span className="text-1xl font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {leaderboardloading
                  ? "Loading..."
                  : `${groupLeaderboard.length} Participants`}
              </span>
            </div>

            <LeaderboardList
              data={groupLeaderboard}
              username={session?.user?.user_metadata?.profilename}
            />
          </div>
        </div>

        {/* LEFT SIDEBAR: GROUPS */}

        

        

        <div className="w-32  border-gray-300 flex flex-col bg-[#18181b] shadow-lg rounded-t-2xl">
          <div className="p-4 border-b border-gray-300 flex justify-between items-center h-16">
            <h3 className="font-bold text-[#fafafa]">Groups</h3>
          </div>

          <div className="flex-1">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`p-4 text-[#fafafa] cursor-pointer border-b border-[#27272a] hover:bg-[#27272a] transition ${
                  activeGroupId === group.id ? "bg-[#27272a] font-semibold" : ""
                }`}
              >
                # {group.name}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: CHAT AREA */}
        
        <div className="flex-1 flex flex-col shadow-lg">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#27272a] flex justify-between items-center h-16 bg-[#18181b] rounded-t-2xl">
            <h3 className="font-bold text-lg text-[#fafafa]">{activeGroupName} </h3>

            <div className="flex gap-4">
              <button onClick={handleGroupJoin}>
                <Users className="w-8 h-8 text-[#fafafa]" />
              </button>

              <button onClick={handleCreateGroup}>
                <PlusCircle className="w-8 h-8 text-[#fafafa]" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          {loading && (
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
            </div>
          )}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-4 bg-[#09090b]">
            {messages.map((msg) => {
              const isMe = msg.sender_id === session.user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={msg.profiles?.profileavatarurl} />
                      <AvatarFallback>
                        {msg.profiles?.profilename?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[60%] px-4 py-2 rounded-2xl shadow ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-black rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1 opacity-70">
                      {msg.profiles?.profilename}
                    </div>

                    <div className="text-lg">{msg.content}</div>
                    <div className="text-[14px] opacity-60 text-right mt-1">
                      {new Date(msg.created_at).toLocaleString("en-GB")}
                    </div>
                  </div>

                  {isMe && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={msg.profiles?.profileavatarurl} />
                      <AvatarFallback>
                        {msg.profiles?.profilename?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-5 border-t border-[#27272a] flex gap-2 bg-[#18181b] rounded-b-2xl"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-[#27272a] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#18181b] text-[#fafafa]"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;
