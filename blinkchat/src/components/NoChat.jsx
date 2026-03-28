import { MessageSquare } from "lucide-react";
import React from "react";

const NoChat = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <div className="flex items-center justify-center w-full mb-2">
          <div className="rounded-full p-4 border-dotted border-4 border-white/40">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">
          Welcome to Blink<span className="text-green-600">Chat</span> !
        </h2>
        <p className="text-white/80">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChat;
