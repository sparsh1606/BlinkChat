import { ChatContext } from "@/context/ChatContext";
import { Image, Send, User, X } from "lucide-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import toast from "react-hot-toast";

const ChatWindow = () => {
  const messageEndRef = useRef(null);
  const {
    selectedUser,
    setSelectedUser,
    messages,
    setMessages,
    senderUser,
    userMessagesLoading,
    socket,
    onlineUsers,
  } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [image, setImage] = useState();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("/api/getsenderinfo");
      const user = res.data.user;
      const result = await axios.post(`/api/send/${selectedUser._id}`, {
        text,
        imageUrl: image,
      });
      const message = result.data.message;
      setText("");
      setImage("");
      socket.emit("sendMessage", {
        senderID: user._id,
        recieverID: selectedUser._id,
        message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        console.log(reader);
        const uploadResult = await axios.post("/api/upload", {
          image: reader.result,
        });
        const imageUrl = uploadResult.data.url;
        setImage(imageUrl);
      } catch (error) {
        console.log(error);
        toast.error("Try Again");
      }
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-white/20 h-20 px-2 py-6  w-full flex items-center gap-4">
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center justify-start gap-3">
            <div className="relative">
              <div className="overflow-hidden border border-white/30 flex justify-center items-center rounded-full w-12 h-12">
                {selectedUser?.profilepic ? (
                  <img
                    src={selectedUser.profilepic}
                    alt="profile"
                    className="-z-30 w-full h-full object-cover group-hover:opacity-20 transition-opacity"
                  />
                ) : (
                  <User size={20} color="white" />
                )}
              </div>
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              ) : (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-800  border-2 border-black rounded-full"></span>
              )}
            </div>
            <div className="text-xl font-semibold">{selectedUser.fullname}</div>
          </div>
          <div onClick={() => setSelectedUser()}>
            <X className="text-white/70 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex-1 w-full px-4 overflow-y-auto">
        {userMessagesLoading ? (
          <div className="flex items-center justify-center mt-6">
            <MoonLoader size={30} color="white" />
          </div>
        ) : (
          messages.map((message) => {
            return (
              <div
                key={message._id}
                className={`w-auto flex my-2 ${message.senderID === senderUser._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md wrap-break-word h-auto rounded-lg px-2 py-1 text-md text-white ${message.senderID === senderUser._id ? " bg-green-900 justify-end" : "bg-gray-700/60 justify-start"}`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="image"
                      className="rounded-lg"
                    />
                  )}
                  {message.text}
                  <div
                    className={`flex w-full ${message.senderID === senderUser._id ? "justify-end" : "justify-start"}`}
                  >
                    <span className="text-xs text-white/50">
                      {new Date(message.createdAt).toTimeString().slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input */}

      {image && (
        <div className="w-full px-2 py-3 backdrop-blur border border-white/30 border-b-0 rounded-lg">
          <div className="relative w-24 h-24">
            <img
              src={image}
              alt="preview"
              className="w-full h-full object-cover rounded-lg border border-white/20"
            />
            <button
              type="button"
              onClick={() => {
                setImage("");
              }}
              className="absolute cursor-pointer -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X size={12} color="white" />
            </button>
          </div>
        </div>
      )}
      <div className="flex py-3 px-4">
        <form
          onSubmit={handleMessageSubmit}
          className="flex gap-2 items-center w-full"
        >
          <input
            autoComplete="off"
            type="text"
            id="text"
            name="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none h-auto flex-1 border border-white/40 rounded-md px-2 py-2 w-full outline-none focus:border-green-500"
          ></input>

          {/* TODO OF IMAGES */}
          <div className="border p-2 rounded-md border-white/20 text-white/90 hover:text-green-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40">
            <label htmlFor="inputImage" className="inset-0">
              <Image size={21} className="shadow-md cursor-pointer" />
            </label>
            <input
              type="file"
              name="image"
              id="inputImage"
              className="hidden"
              onChange={handleImageInput}
            />
          </div>

          <button
            disabled={!text.trim() && !image}
            type="submit"
            className="border p-2 rounded-md border-white/20 text-white/90 hover:text-green-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={21} className="shadow-md" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
