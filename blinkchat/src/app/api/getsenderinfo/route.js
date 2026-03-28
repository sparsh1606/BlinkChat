import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/user.model";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const myemail = decoded.email;
  const user = await User.findOne({ email: myemail });
  return NextResponse.json({ user }, {status:200});
}
