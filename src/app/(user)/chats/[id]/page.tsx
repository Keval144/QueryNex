export const dynamic = "force-dynamic";

import { getSession } from "@/lib/get-session";
import ChatBotDemo from "./chat-bot";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  return (
    <Suspense fallback="Loading">
      <ChatBotDemo chatId={id} userId={session?.user.id} />
    </Suspense>
  );
}
