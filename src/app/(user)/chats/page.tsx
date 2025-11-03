import EmptyChat from "@/components/chats/empty-chat";
import { getSession } from "@/lib/get-session";
import { db } from "@/db/drizzle";
import { chat } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";

export default async function Page() {
  const session = await getSession();

  if (!session?.user?.id) {
    return <EmptyChat />;
  }

  const chats = await db
    .select()
    .from(chat)
    .where(eq(chat.userId, session.user.id));

  if (!Array.isArray(chats) || chats.length < 1) {
    return <EmptyChat />;
  }

  return (
    <div>
      <h1>User Chats</h1>
      {chats.map((chat) => (
        <div key={chat.id}>
          <p>{chat.title}</p>
          <p>{chat.dataString}</p>
        </div>
      ))}
    </div>
  );
}
