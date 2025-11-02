"use server";

import { db } from "@/db/drizzle";
import { newsletter } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addEmail(email: string) {
  try {
    const existing = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.email, email));

    if (existing.length > 0) {
      return { success: false, message: "You’re already subscribed!" };
    }

    await db.insert(newsletter).values({ email });

    return { success: true, message: "Thanks for subscribing!" };
  } catch (error: any) {
    console.error("❌ Database error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
