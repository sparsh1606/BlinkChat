"use client";

import axios from "axios";
import { createContext, useState } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [userMessagesLoading, setUserMessagesLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [senderUser, setSenderUser] = useState();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnileUsers] = useState([]);

  const getMessages = async (selectedUserId) => {
    try {
      const result = await axios.get(`/api/getmessages/${selectedUserId}`);
      setMessages(result.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const connectToSocket = (userId) => {
    if (socket?.connected) return;
    const newSocket = io("https://blinkchat-afxv.onrender.com", {
      autoConnect: false,
    });

    newSocket.connect();
    newSocket.emit("register", userId);
    newSocket.on("onlineUsers", (users) => {
      setOnileUsers(users);
    });

    setSocket(newSocket);
  };
  const disconnectToSocket = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const data = {
    selectedUser,
    setSelectedUser,
    senderUser,
    setSenderUser,
    messages,
    setMessages,
    getMessages,
    connectToSocket,
    disconnectToSocket,
    userMessagesLoading,
    setUserMessagesLoading,
    socket,
    onlineUsers,
  };
  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
};
