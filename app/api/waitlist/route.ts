import connectDB from "@/lib/db";
import { Lead } from "@/schemas/leads.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 404 }
      );
    }

    await connectDB();

    const isWaitlisted = await Lead.findOne({ email });

    if (isWaitlisted)
      return NextResponse.json(
        {
          success: false,
          message: "Already added to the waitlist",
        },
        { status: 400 }
      );

    await Lead.create({
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead collected successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in collecting email: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
