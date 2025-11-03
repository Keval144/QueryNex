import SidebarWrapperClient from "@/components/chats/sidebar-provider";
import { ThemeSwitch } from "@/components/common/theme-switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { Button } from "@/components/shadcn-ui/button";
import { Separator } from "@/components/shadcn-ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/shadcn-ui/sidebar";
import { getSession } from "@/lib/get-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieStore = await cookies();
const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

export default async function Page() {
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-dvh flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarWrapperClient>
  );
}
