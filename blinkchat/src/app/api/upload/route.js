import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { image } = await request.json();
    const result = await cloudinary.uploader.upload(image, {
      folder: "blinkchat",
    });
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal server error ${error}` },
      { status: 500 },
    );
  }
}
