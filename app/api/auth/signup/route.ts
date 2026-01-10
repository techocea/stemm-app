import connectDB from "@/lib/db";
import { User } from "@/schemas/users.schema";
import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { encrypt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email)
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );

    const verifyToken = await encrypt({ email });

    await User.create({
      email,
      verifyToken,
      verifyTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
    });

    await sendVerificationEmail(email, verifyToken);

    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user", error },
      { status: 500 }
    );
  }
}
