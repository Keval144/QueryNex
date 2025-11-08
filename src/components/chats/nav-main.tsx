"use client";

import {
  ChevronRight,
  MessageCircle,
  MessageCirclePlus,
  type LucideIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn-ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn-ui/sidebar";
import { LogoQuery } from "../../../public/Logo/logo";
import Link from "next/link";
import CreateChat from "./create-chat";
import { Button } from "../shadcn-ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  return (
    <SidebarGroup>
      {/* ✅ Logo */}
      <div className="ml-2 flex items-center">
        <LogoQuery className="h-6 w-6 text-[#1d9bf0]" />
      </div>

      {/* ✅ Section Label */}
      <SidebarGroupLabel className="text-muted-foreground/70 mt-3 text-xs font-semibold uppercase">
        Chats
      </SidebarGroupLabel>

      {/* ✅ Main Chat Link */}
      <SidebarMenu>
        {/* 🔗 All Chats link */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/chats" className="flex items-center gap-2">
              <MessageCircle className="text-muted-foreground h-4 w-4" />
              <span>All Chats</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex cursor-pointer items-center gap-2">
              <CreateChat
                trigger={
                  <div className="flex items-center gap-2">
                    <MessageCirclePlus className="text-muted-foreground h-4 w-4" />
                  </div>
                }
              />
              <span>Create Chat</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* ✅ Dynamic Collapsible List */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && (
                    <item.icon className="text-muted-foreground h-4 w-4" />
                  )}
                  <span className="ml-2">{item.title}</span>
                  <ChevronRight className="text-muted-foreground ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
