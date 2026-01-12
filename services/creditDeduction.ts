"use server";

import { SERVICE_COSTS } from "@/app/utils/constants";
import connectDB from "@/lib/db";
import { User } from "@/schemas/users.schema";
import { CreditDeductionType } from "@/types";

export async function handleCreditDeduction({
  userId,
  serviceType,
}: CreditDeductionType) {
  const cost = SERVICE_COSTS[serviceType];

  await connectDB();
  const currentCredits = await User.findById(userId).select("credits");

  if (currentCredits && currentCredits.credits >= cost) {
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: -cost },
    });
    return { success: true };
  } else {
    return { success: false, message: "Top up needed" };
  }
}
