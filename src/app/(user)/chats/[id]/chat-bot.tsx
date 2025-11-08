"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/shadcn-ui/input-group";
import { Separator } from "@/components/shadcn-ui/separator";
import { IconPlus } from "@tabler/icons-react";
import {
  ArrowUpIcon,
  DownloadIcon,
  Bot,
  User,
  FileSpreadsheet,
} from "lucide-react";
import { useParams } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";

// 🗂️ Detailed Type Definitions
type ExcelData = {
  base64: string;
  fileName: string;
  sheetName: string;
  rowCount: number;
  columnCount: number;
};

type MessageType = {
  id: string;
  content: string;
  senderId: string;
  sqlResult?: string | null;
  excelData?: string | null; // This is stored as JSON string in DB
  createdAt?: string;
};

// Helper to parse Excel data
function parseExcelData(excelDataString: string | null): ExcelData | null {
  if (!excelDataString) return null;
  try {
    return JSON.parse(excelDataString) as ExcelData;
  } catch (error) {
    console.error("Error parsing Excel data:", error);
    return null;
  }
}

export default function SQLChatClient({
  chatId,
  userId,
}: {
  chatId?: string;
  userId?: string;
}) {
  const params = useParams();
  const [isPending, setIsPending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolvedChatId = chatId || (params.id as string);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`/api/messages/${resolvedChatId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    loadMessages();
  }, [resolvedChatId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage: MessageType = {
      id: `temp-${Date.now()}`,
      content: inputValue,
      senderId: userId!,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsPending(true);

    try {
      const response = await fetch(`/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: resolvedChatId,
          userId,
          content: inputValue,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const result = await response.json();

      // Create assistant message with data from response
      const assistantMessage: MessageType = {
        id: `temp-assistant-${Date.now()}`,
        content: result.text,
        senderId: "1",
        sqlResult: result.extractedQuery || null,
        excelData: result.excelData ? JSON.stringify(result.excelData) : null,
      };

      // Update messages with both user and assistant messages
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.id.startsWith("temp-"))
          .concat([userMessage, assistantMessage]),
      );

      // Refetch from database to get proper IDs
      setTimeout(async () => {
        const messagesRes = await fetch(`/api/messages/${resolvedChatId}`);
        const updatedMessages = await messagesRes.json();
        setMessages(updatedMessages);
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      setInputValue(userMessage.content);
    } finally {
      setIsPending(false);
    }
  };

  // 📊 Enhanced Excel Download Function
  const handleDownloadExcel = (excelDataString: string) => {
    try {
      const excelData = parseExcelData(excelDataString);
      if (!excelData) {
        throw new Error("Invalid Excel data format");
      }

      const { base64, fileName } = excelData;

      // Clean base64 string (remove data URL prefix if present)
      const cleanBase64 = base64.replace(/^data:.*;base64,/, "");

      // Convert base64 to binary
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and download
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL
      window.URL.revokeObjectURL(url);

      console.log(`✅ Excel file downloaded: ${fileName}`);
    } catch (error) {
      console.error("❌ Error downloading Excel file:", error);
      alert(
        "Failed to download Excel file. The file may be corrupted or in an invalid format.",
      );
    }
  };

  // 🎨 Enhanced Excel Download Button Component
  const ExcelDownloadButton = ({
    excelDataString,
  }: {
    excelDataString: string;
  }) => {
    const excelData = parseExcelData(excelDataString);

    if (!excelData) {
      return (
        <div className="mt-2 text-xs text-red-500">
          Invalid Excel data format
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadExcel(excelDataString)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-md"
          >
            <FileSpreadsheet size={16} />
            Download Excel Results
          </button>

          {/* File Info Badge */}
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
            <FileSpreadsheet size={12} />
            <span>
              {excelData.rowCount} rows × {excelData.columnCount} columns
            </span>
          </div>
        </div>

        {/* File Details */}
        <div className="text-xs text-gray-500">
          File: {excelData.fileName} • Sheet: {excelData.sheetName}
        </div>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 🧠 Helper: Renders message with SQL code blocks copyable
  function renderMessageContent(content: string) {
    const sqlRegex = /```sql([\s\S]*?)```/g;
    const parts: (string | JSX.Element)[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = sqlRegex.exec(content)) !== null) {
      const [fullMatch, sqlCode] = match;
      const startIndex = match.index;

      // Push plain text before code block
      if (startIndex > lastIndex) {
        parts.push(content.slice(lastIndex, startIndex));
      }

      // Push formatted SQL code block with copy button
      parts.push(
        <div
          key={startIndex}
          className="bg-muted/40 text-foreground/90 relative my-3 w-full rounded-lg border p-4 font-mono text-sm"
        >
          <button
            onClick={() => navigator.clipboard.writeText(sqlCode.trim())}
            className="bg-muted text-foreground/70 hover:bg-muted-foreground/10 absolute top-2 right-2 rounded-md px-2 py-1 text-xs transition-colors"
          >
            Copy
          </button>
          <pre className="overflow-x-auto whitespace-pre-wrap">
            {sqlCode.trim()}
          </pre>
        </div>,
      );

      lastIndex = sqlRegex.lastIndex;
    }

    // Push any text after the last code block
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length ? parts : content;
  }

  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Messages Area - This will scroll */}
      <div ref={chatRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {messages.length === 0 && (
            <div className="flex h-64 items-center justify-center text-center">
              <div className="max-w-md space-y-4">
                <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                  <Bot className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Start a conversation</h3>
                <p className="text-muted-foreground text-sm">
                  Ask questions about your data and get SQL queries with results
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) => {
              const parsedExcelData = parseExcelData(msg.excelData || null);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.senderId === userId ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.senderId === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.senderId === userId ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex max-w-[80%] flex-col gap-2 ${
                      msg.senderId === userId ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.senderId === userId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="wrap-break-word whitespace-pre-wrap">
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>

                    {/* Excel Download */}
                    {msg.excelData && (
                      <ExcelDownloadButton excelDataString={msg.excelData} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isPending && (
              <div className="flex gap-4">
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex max-w-[80%] flex-col gap-2">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-current"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-current"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm">Generating response...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-background/95 border-t p-4 backdrop-blur">
        <div className="mx-auto max-w-4xl">
          <InputGroup className="h-10 shadow-sm">
            <InputGroupTextarea
              placeholder="Ask a question about your data..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
            />

            <InputGroupAddon align="block-end">
              <InputGroupButton
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                disabled={isPending}
              >
                <IconPlus />
              </InputGroupButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton variant="ghost" disabled={isPending}>
                    GPT-4o-mini
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start">
                  <DropdownMenuItem>GPT-4o-mini</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <InputGroupText className="ml-auto">Free</InputGroupText>
              <Separator orientation="vertical" className="h-4" />
              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xs"
                disabled={isPending || !inputValue.trim()}
                onClick={handleSendMessage}
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
