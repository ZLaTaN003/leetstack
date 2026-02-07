import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Trophy } from "lucide-react";

import LeaderboardList from "@/components/ui/LeaderBoardList";
const BasicChat = () => {
  // --- STATE ---
  const [activeGroupId, setActiveGroupId] = useState(1);
  const [inputText, setInputText] = useState("");

  // 1. Groups Data
  const [groups, setGroups] = useState([
    { id: 1, name: "General" },
    { id: 2, name: "Random" },
  ]);

  // 2. Messages Data
  const [messages, setMessages] = useState([
    { id: 1, groupId: 1, sender: "Alice", text: "Hello world!" },
    { id: 2, groupId: 1, sender: "You", text: "Hey Alice, how are you?" },
    { id: 3, groupId: 2, sender: "Bob", text: "Anyone here?" },
  ]);

  // --- HANDLERS ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      groupId: activeGroupId,
      sender: "You",
      text: inputText,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const handleCreateGroup = () => {
    const name = prompt("Enter group name:");
    if (name) {
      setGroups([...groups, { id: Date.now(), name }]);
    }
  };

  const currentMessages = messages.filter((m) => m.groupId === activeGroupId);
  const activeGroupName = groups.find((g) => g.id === activeGroupId).name;

  // --- RENDER ---
  return (
    <div className="flex h-screen font-sans bg-red-50 p-6">
        {/* LEFT SIDE: LEADERBOARD */}
        <div className="max-w-3xl w-full h-full mr-4">
        <div className=" min-h-100 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex justify-start flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Current Standings
            </h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {10} Participants
            </span>
          </div>

              <LeaderboardList data={[]} username={null} />
            
        </div>
      </div>

      {/* LEFT SIDEBAR: GROUPS */}
      <div className="w-32  border-gray-300 flex flex-col bg-white shadow-lg rounded-t-2xl">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center h-16">
          <h3 className="font-bold text-gray-700">Groups</h3>
        </div>

        <div className="flex-1">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition ${
                activeGroupId === group.id ? "bg-gray-200 font-semibold" : ""
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
        <div className="p-4 border-b border-gray-300 flex justify-between items-center h-16 bg-white rounded-t-2xl">
          <h3 className="font-bold text-lg">{activeGroupName} </h3>
          <button onClick={handleCreateGroup}>
            <PlusCircle className="w-8 h-8" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-2 bg-white">
          {currentMessages.map((msg) => {
            const isMe = msg.sender === "You";
            return (
              <div
                key={msg.id}
                className={`max-w-[60%] px-4 py-2 rounded-2xl leading-snug ${
                  isMe
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-100 text-black"
                }`}
              >
                {!isMe && (
                  <small className="block text-xs opacity-70 mb-1">
                    {msg.sender}
                  </small>
                )}
                <div>{msg.text}</div>
              </div>
            );
          })}
          {currentMessages.length === 0 && (
            <p className="text-gray-400 text-center mt-4">No messages yet.</p>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-5 border-t border-gray-300 flex gap-2 bg-white rounded-b-2xl"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

export default BasicChat;
