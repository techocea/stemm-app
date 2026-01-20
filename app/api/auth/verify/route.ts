import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/schemas/users.schema";
import { decrypt, encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 400 },
    );
  }

  try {
    const payload = await decrypt(token);

    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: "Invalid token structure" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: payload.email,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid user" },
        { status: 400 },
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    user.credits = 15;
    await user.save();

    const session = await encrypt({ user: payload.email });
    (await cookies()).set("session", session, { httpOnly: true, secure: true });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
