import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/user.model";
import connectDb from "@/lib/db";

export async function GET(request) {
  try {
    await connectDb();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorise Login to continue" },
        { status: 400 },
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const myemail = decoded.email;

    const user = await User.findOne({ email: myemail });
    const myID = user._id;

    const allUsers = await User.find({ _id: { $ne: myID } })
      .sort({ lastMessageAt: -1 })
      .select(["-password", "-createdAt", "-updatedAt"]);

    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal server error ${error.message}` },
      { status: 500 },
    );
  }
}
