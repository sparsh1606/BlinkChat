import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/user.model";
import connectDb from "@/lib/db";

export async function PUT(request) {
  const { imageUrl } = await request.json();
  try {
    await connectDb();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorise" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const myemail = decoded.email;

    const user = await User.findOne({ email: myemail });

    await User.findByIdAndUpdate(user._id, { profilepic: imageUrl });

    return NextResponse.json({ message: "profile Updated" }, { status: 200  });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal server error ${error.message}` },
      { status: 500 },
    );
  }
}
