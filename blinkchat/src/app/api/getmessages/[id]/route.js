import connectDb from "@/lib/db";
import User from "@/model/user.model";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Message from "@/model/message.model";

export async function GET(request, { params }) {
  const { id: recieverID } = await params;

  try {
    await connectDb();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorise" }, { status: 400 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const myemail = decoded.email;

    const user = await User.findOne({ email: myemail }).select("-password");

    const senderID = user._id;

    const messages = await Message.find({
      $or: [
        { senderID: senderID, recieverID: recieverID },
        { senderID: recieverID, recieverID: senderID },
      ],
    });

    console.log(messages);
    return NextResponse.json({message: messages}, {status: 200})
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal server error ${error.message}` },
      { status: 500 },
    );
  }
}
