"use client";

import * as React from "react";
import { SquareTerminal } from "lucide-react";
import { NavMain } from "@/components/chats/nav-main";
import { NavUser } from "../admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcn-ui/sidebar";
import Link from "next/link";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string };
}) {
  const [chatItems, setChatItems] = React.useState<
    { title: string; url: string }[]
  >([]);

  // ✅ Fetch all chats from /api/chat
  React.useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();
        // Expecting array of chats with `id` and `title`
        const formatted = (data || []).map((chat: any) => ({
          title: chat.title || "Untitled Chat",
          url: `/chats/${chat.id}`,
        }));
        setChatItems(formatted);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    }
    fetchChats();
  }, []);

  const navData = {
    navMain: [
      {
        title: "Chats",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: chatItems.length
          ? chatItems
          : [{ title: "Loading...", url: "#" }],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} className="group/sidebar">
      <SidebarContent>
        <NavMain items={navData.navMain} />
       
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
