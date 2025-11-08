import EmptyChat from "@/components/chats/empty-chat";
import { getSession } from "@/lib/get-session";
import { db } from "@/db/drizzle";
import { chat } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import {
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  ShieldX,
  Calendar,
  Database,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { IconMessage2 } from "@tabler/icons-react";

export default async function Page() {
  const session = await getSession();

  if (!session?.user?.id) {
    return <EmptyChat />;
  }

  const chats = await db
    .select()
    .from(chat)
    .where(eq(chat.userId, session.user.id));

  if (chats.length == 0) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center">
        <EmptyChat />
      </section>
    );
  }

  return (
    <section className="h-auto p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <MessageCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold">Your Conversations</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Manage and continue your previous chat sessions
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{chats.length}</p>
              <p className="text-muted-foreground text-sm">Total Chats</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {chats.filter((c) => c.safemode).length}
              </p>
              <p className="text-muted-foreground text-sm">Safe Mode</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {chats.map((c) => (
            <Card
              key={c.id}
              className="group relative overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <IconMessage2 className="h-20 w-20" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">
                        {c.title || "Untitled Chat"}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Info */}
                <div className="flex items-center gap-2 text-sm">
                  <Database className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground flex-1 truncate">
                    {c.database || "No database selected"}
                  </span>
                </div>

                {/* Safe Mode Badge */}
                <div className="flex items-center justify-between">
                  {c.safemode ? (
                    <Badge variant="default" className="border-0 bg-green-600">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Safe Mode
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="border-0">
                      <ShieldX className="mr-1 h-3 w-3" />
                      Unsafe Mode
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-2">
                  <a href={`/chats/${c.id}`} className="block">
                    <Button
                      variant="default"
                      size="sm"
                      className="group/btn w-full cursor-pointer transition-all duration-200"
                    >
                      Continue Chat
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
