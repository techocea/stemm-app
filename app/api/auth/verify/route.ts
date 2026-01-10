import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/schemas/users.schema";
import { decrypt, encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  await connectDB();

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const payload = await decrypt(token);

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  user.credits = 15; // Initial reward for verifying
  await user.save();

  const session = await encrypt({ user: payload.email });
  (await cookies()).set("session", session, { httpOnly: true, secure: true });

  return NextResponse.redirect(new URL("/", request.url));
}
