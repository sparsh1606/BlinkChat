import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Message from "@/model/message.model";
import User from "@/model/user.model";

export async function POST(request, { params }) {
  const { id: recieverID } = await params;
  const { text, imageUrl } = await request.json();
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorise" }, { status: 400 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const myemail = decoded.email;

    const user = await User.findOne({ email: myemail });

    const senderID = user._id;

    const newMessage = new Message({
      senderID,
      recieverID,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    await User.findByIdAndUpdate(senderID, { lastMessageAt: new Date() });
    await User.findByIdAndUpdate(recieverID, { lastMessageAt: new Date() });

    // socketio

    return NextResponse.json({ message: newMessage }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal server error ${error.message}` },
      { status: 500 },
    );
  }
}
