import { NextResponse } from "next/server";

export function POST(request) {
  try {
    const response = NextResponse.json(
      { message: "User Logged out" },
      { status: 200 },
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    console.log(`Error occured: ${error}`);
    return NextResponse.json({ message: `Error occured` }, { status: 500 });
  }
}
