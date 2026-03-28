import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, User } from "lucide-react";
import { ChatContext } from "@/context/ChatContext";
import { MoonLoader } from "react-spinners";

const Sidebar = () => {
  const {
    selectedUser,
    setSelectedUser,
    senderUser,
    setSenderUser,
    userMessagesLoading,
    setUserMessagesLoading,
    messages,
    setMessages,
    onlineUsers,
    disconnectToSocket,
  } = useContext(ChatContext);
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getUsers = async () => {
      try {
        const result = await axios.get("/api/getusers");

        setAllUsers(result.data.allUsers);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, [messages]);
  useEffect(() => {
    const getSenderUser = async () => {
      const result = await axios.get("/api/getsenderinfo");
      setSenderUser(result.data.user);
    };

    getSenderUser();
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserMessagesLoading(true);
    try {
      const result = await axios.get(`/api/getmessages/${user._id}`);
      setMessages(result.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setUserMessagesLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await axios.post("/api/logout");

      if (result.status === 200) {
        toast.success(result.data.message);
        disconnectToSocket();
        router.push("/login");
        setSelectedUser();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error || "An error occured");
    }
  };

  const handleProfileUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const uploadResult = await axios.post("/api/upload", {
          image: reader.result,
        });
        const imageUrl = uploadResult.data.url;
        await axios.put("/api/updateProfile", {
          imageUrl: imageUrl,
        });
        setSenderUser((prev) => ({ ...prev, profilepic: imageUrl }));
        toast.success("Profile Updated");
      } catch (error) {
        console.log(error);
        toast.error("Try Again");
      }
    };
  };

  return (
    <div className="hidden md:block w-1/3 border-r border-white/20 overflow-y-auto">
      <div className="w-full flex items-center justify-between border-b border-white/20 h-20 px-2 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="overflow-hidden group relative border border-white/30 flex justify-center items-center rounded-full w-12 h-12 cursor-pointer hover:bg-green-200/20">
            {senderUser?.profilepic ? (
              <img
                src={senderUser.profilepic}
                alt="profile"
                className="-z-30 w-full h-full object-cover group-hover:opacity-20 transition-opacity"
              />
            ) : (
              <User
                size={30}
                color="white"
                className="group-hover:opacity-20 transition-opacity"
              />
            )}

            <label
              htmlFor="profileUpload"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Pencil size={20} color="white" />
            </label>
            <input
              id="profileUpload"
              type="file"
              className="hidden"
              onChange={handleProfileUpdate}
            />
          </div>
          <div>
            <h6 className="text-lg font-semibold">{senderUser?.fullname}</h6>
          </div>
        </div>
        <div onClick={handleLogout}>
          <LogOut className="opacity-80 hover:text-red-700 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
      <div className="h-[564.8px] px-4 py-2 overflow-y-auto">
        <div className="text-white/40 mb-4">Chats</div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <MoonLoader size={30} color="white" />
          </div>
        ) : (
          allUsers.map((user) => {
            return (
              <button
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`w-full border px-2 py-3 rounded-xl mb-2 cursor-pointer hover:bg-white/5 shadow-2xl border-white/10 ${selectedUser === user ? "bg-white/5" : ""} transition-all duration-75`}
              >
                <div className="flex items-center justify-start gap-3 text-center">
                  <div className="relative">
                    <div className="overflow-hidden border border-white/30 flex justify-center items-center rounded-full w-10 h-10">
                      {user?.profilepic ? (
                        <img
                          src={user.profilepic}
                          alt="profile"
                          className="-z-30 w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} color="white" />
                      )}
                    </div>

                    {onlineUsers.includes(user._id) ? (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-800  border-2 border-black rounded-full"></span>
                    )}
                  </div>
                  <div>{user.fullname}</div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
