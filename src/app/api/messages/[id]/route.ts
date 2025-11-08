import { db } from "@/db/drizzle";
import { message } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params; // ✅ unwrap Promise
    const messages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, id));

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
