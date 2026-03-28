"use client";
import React, { useContext, useState } from "react";
import { UserKey, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChatContext } from "@/context/ChatContext";
import { signIn } from "next-auth/react";

const Longin = () => {
  const { connectToSocket, socket } = useContext(ChatContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/login", {
        email,
        password,
      });

      if (result.status === 201) {
        toast.success(result.data.message);
        router.push("/");
        const res = await axios.get("/api/getsenderinfo");
        const user = res.data.user;
        connectToSocket(user._id);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occured",
      );
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div className="w-auto min-w-1/3 overflow-y-auto max-h-10/12 md:max-w-3/4 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/20">
      <div className="p-8 px-4">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/10 shadow-xl shadow-green-300/20 border border-green-300/20 mb-5">
            <UserKey size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-black">Welcome Back...</h1>
        <p className="text-md text-white/60 mb-4">Login to chat</p>
        <div>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4 relative">
              <label htmlFor="email" className="text-lg font-semibold mb-2">
                Email
              </label>
              <br />
              <input
                type="email"
                id="email"
                className=" w-full border-2 rounded-md p-2 pl-9 outline-none border-white/30 focus:border-green-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
              <Mail className="absolute left-2 top-[53%] text-white/70" />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="text-lg font-semibold mb-2">
                Password
              </label>
              <br />
              <input
                type="password"
                className="w-full border-2 rounded-md p-2 pl-9 outline-none border-white/30 focus:border-green-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              <Lock className="absolute left-2 top-[53%] text-white/70" />
            </div>
            <div className="mb-2 mt-6 ">
              <Link
                className="text-white/60 text-sm hover:text-green-600"
                href={"/signup"}
              >
                Don't have an account? Signup
              </Link>
            </div>
            <div className="mb-4 mt-4 flex justify-center items-center">
              <button className="w-full text-center p-3 bg-green-700 hover:bg-green-700/70 rounded-2xl cursor-pointer text-lg font-bold">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Longin;
