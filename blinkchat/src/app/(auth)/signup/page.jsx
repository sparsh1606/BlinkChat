"use client";
import { Lock, Mail, User, UserKey } from "lucide-react";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatContext } from "@/context/ChatContext";

const Signup = () => {
  const { connectToSocket, socket } = useContext(ChatContext);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignupClick = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/signup", {
        fullname,
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
        error.response?.data?.message || error.message || "An error occurred",
      );
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div className="w-auto min-w-1/3 overflow-y-auto max-h-10/12 md:max-w-1/2 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/20">
      <div className="p-8 px-4">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/10 shadow-xl shadow-green-300/20 border border-green-300/20 mb-3">
            <UserKey size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-black">Make your Account</h1>
        <p className="text-md text-white/60 mb-4">Register to chat</p>
        <div>
          <form onSubmit={handleSignupClick}>
            <div className="mb-4 relative">
              <label
                htmlFor="fullname"
                className="text-md font-semibold block mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                className="w-full border-2 rounded-md p-2 pl-9 outline-none border-white/30 focus:border-green-600"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter Full Name"
                required
              />
              <User className="absolute left-2 top-[53%] text-white/70" />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="email"
                className="text-md font-semibold block mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className=" w-full border-2 rounded-md p-2 pl-9 outline-none border-white/30 focus:border-green-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
              <Mail className="absolute left-2 top-[53%] text-white/70" />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="text-md font-semibold block mb-1"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full border-2 rounded-md p-2 pl-9 outline-none border-white/30 focus:border-green-600"
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
                href={"/login"}
              >
                Already have an account? Login
              </Link>
            </div>
            <div className="mb-4 mt-4 flex justify-center items-center">
              <button
                type="submit"
                className="w-full text-center p-3 bg-green-700 hover:bg-green-700/70 rounded-2xl cursor-pointer text-lg font-bold"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
