import { ThemeSwitch } from "@/components/common/theme-switch";
import SidebarWrapperClient from "@/components/chats/sidebar-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { Button } from "@/components/shadcn-ui/button";
import { Separator } from "@/components/shadcn-ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/shadcn-ui/sidebar";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function ChatLayout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await getSession();
  if (!session) redirect("/sign-in");
  const user = session?.user;

  if (user.role === "admin") redirect("/dashboard");
  const safeUser = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.image ?? "/assets/pfp.jpg",
  };

  return (
    <>
      <SidebarWrapperClient defaultOpen={defaultOpen} user={safeUser}>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Chats</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* 🌙 Right-side Theme Switch */}
            <div className="ml-auto flex items-center gap-2 px-4">
              <Button variant="ghost" asChild size="sm">
                <ThemeSwitch />
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarWrapperClient>
    </>
  );
}

export default ChatLayout;
