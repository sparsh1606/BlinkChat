import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDb();

    const { fullname, email, password } = await request.json();
    if (!fullname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Passowrd must be longer than 6 characters" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const response = NextResponse.json(
      { message: "User created" },
      { status: 201 },
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.log(`Error in signup ${error}`);
    return NextResponse.json(
      { message: `Error in signup ${error}` },
      { status: 500 },
    );
  }
}
