import connectDB from "@/lib/db";
import { Feedback } from "@/schemas/feedback.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Field required" },
        { status: 404 }
      );
    }

    await connectDB();

    const newFeedback = await Feedback.create({
      message,
    });

    return NextResponse.json(
      {
        success: true,
        newFeedback,
        message: "Feedback submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
