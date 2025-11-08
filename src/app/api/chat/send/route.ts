import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chat, message } from "@/db/schema";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { eq } from "drizzle-orm";
import { getSchema } from "@/lib/get-schema";
import { decrypt } from "@/lib/crypto";
import { ExecuteQuery } from "@/lib/exec-query";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/get-session";

// 🗂️ Type definitions for Excel data
type ExcelData = {
  base64: string;
  fileName: string;
  sheetName: string;
  rowCount: number;
  columnCount: number;
};

type QueryResult = {
  success: boolean;
  answers?: any;
  error?: string;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { chatId, userId, content } = await req.json();

    const result = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const { safemode, database, dataString } = result[0];

    const schemaRes = await getSchema(decrypt(dataString), database);
    const schemaText = schemaRes.success ? schemaRes.schema : "";

    // Insert user message
    await db.insert(message).values({
      chatId,
      content,
      senderId: userId,
    });

    const prompt = `Table Schema:\n${schemaText}\n\nUser Message: ${content}\n\nSafe Mode: ${safemode ? "ON" : "OFF"}`;

    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const { text } = await generateText({
      model: openrouter("gpt-4o-mini"),
      system: `
        You are an expert Database Designer and SQL specialist.

        Your purpose is to help users with database-related requests only:
        - Design schemas, relationships, normalization, and indexing.
        - Write SQL queries (DDL, DML, SELECT) or suggest optimizations.
        - Always return clean, executable SQL or concise database explanations.
        
        Rules:
        2. Do not engage in small talk or unrelated topics.
        3. Prefer ANSI SQL unless a dialect (PostgreSQL, MySQL, etc.) is specified.
        4. Keep answers short and to the point.
        5. If Safe Mode is ON:
        - Never generate destructive or altering queries (DELETE, UPDATE, DROP, TRUNCATE, ALTER).
        - Only produce analytical SELECT statements or schema inspection queries.
        6. Never include explanations inside the code block.
          - Always wrap SQL queries inside triple backticks like this because it would be executed:
              \`\`\`sql
              
              \`\`\`
        7. if there is more than one query write only in one 
          -   \`\`\`sql
              
              \`\`\` block only 

      `,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 1000,
    });

    const extractedQuery =
      text.match(/```sql([\s\S]*?)```/i)?.[1]?.trim() ||
      text.match(
        /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)[\s\S]*?;/i,
      )?.[0];

    let queryResult: QueryResult | null = null;
    let excelData: ExcelData | null = null;

    // Execute query and generate Excel if it's a SELECT statement
    if (
      extractedQuery &&
      extractedQuery.trim().toUpperCase().startsWith("SELECT")
    ) {
      try {
        queryResult = await ExecuteQuery(
          decrypt(dataString),
          database,
          extractedQuery,
        );

        if (queryResult?.success && !queryResult.error && queryResult.answers) {
          const answers = await queryResult.answers;
          const rows = answers[0];

          if (Array.isArray(rows) && rows.length > 0) {
            // Create Excel workbook
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Query Results");

            // Generate Excel buffer
            const excelBuffer = XLSX.write(workbook, {
              type: "buffer",
              bookType: "xlsx",
            });

            // Create Excel data object
            excelData = {
              base64: excelBuffer.toString("base64"),
              fileName: `query-results-${Date.now()}.xlsx`,
              sheetName: "Query Results",
              rowCount: rows.length,
              columnCount: Object.keys(rows[0] || {}).length,
            };
          }
        }
      } catch (error) {
        console.error("Query execution error:", error);
        queryResult = {
          success: false,
          error: `Query execution failed: ${error}`,
        };
      }
    }

    // Insert assistant message WITH excelData
    await db.insert(message).values({
      chatId,
      content: text,
      sqlResult: extractedQuery ?? null,
      excelData: excelData ? JSON.stringify(excelData) : null, 
      senderId: "1",
    });

    return NextResponse.json({
      success: true,
      text,
      queryResult,
      excelData, 
      extractedQuery,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
