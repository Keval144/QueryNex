import EmptyChat from "@/components/chats/empty-chat";
import { getSession } from "@/lib/get-session";

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id;

  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/chat/${userId}`, {
    cache: "force-cache",
    next: { revalidate: 2 * 60 },
  });

  const chats = await res.json();
  if (!Array.isArray(chats) || chats.length < 1) {
    return <EmptyChat />;
  }
  return (
    <div>
      <h1>User Chats</h1>
      <pre></pre>
    </div>
  );
}
