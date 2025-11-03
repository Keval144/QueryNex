import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chat } from "@/db/schema";
import { getSession } from "@/lib/get-session";
import { createChatSchema } from "@/lib/validation";
import { encrypt } from "@/lib/crypto";
import { testDatabaseConnection } from "@/lib/db-test";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createChatSchema.parse(body);
    const dbTestResult = await testDatabaseConnection(
      validatedData.dataString,
      validatedData.database,
    );

    if (!dbTestResult.success) {
      return NextResponse.json(
        { error: dbTestResult.error || "Database connection test failed" },
        { status: 400 },
      );
    }

    const EncryptedDb = encrypt(validatedData.dataString);

    const [newChat] = await db
      .insert(chat)
      .values({
        userId: session.user.id,
        title: validatedData.title,
        database: validatedData.database,
        dataString: EncryptedDb,
        safemode: validatedData.safemode,
        tokenUsed: 0,
      })
      .returning();

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
