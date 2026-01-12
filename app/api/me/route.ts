import connectDB from "@/lib/db";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/schemas/users.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Invalid or expired token", user: null },
        { status: 401 }
      );
    }

    const decoded = await decrypt(token);
    // console.log("Decoded Token:", decoded);
    const user = await User.findOne({ email: decoded.user });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", user: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      credits: user.credits,
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
