"use client";
import React, { useContext, useEffect } from "react";

import Sidebar from "@/components/Sidebar";
import { ChatContext } from "@/context/ChatContext";
import NoChat from "@/components/NoChat";
import ChatWindow from "@/components/ChatWindow";
import axios from "axios";

const Chat = () => {
  const { selectedUser, connectToSocket } = useContext(ChatContext);

  useEffect(() => {
    const connect = async () => {
      const res = await axios.get("/api/getsenderinfo");
      const user = res.data.user;
      connectToSocket(user._id);
    };

    connect();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center sm:px-8 py-12 ">
      <div className="w-11/12 h-full border border-white/20 flex rounded-2xl backdrop-blur-3xl bg-black/5 shadow-2xl">
        {/* sidebar */}
        <Sidebar />
        <div className="backdrop-blur-3xl w-full">
          {!selectedUser ? <NoChat /> : <ChatWindow />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
