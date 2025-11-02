import { AppNavbar } from "@/components/common/app-navbar";
import { Footer } from "@/components/common/footer";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const role = session?.user?.role;

  if (role === "user") redirect("/chats");
  if (role === "admin") redirect("/dashboard");

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background — fixed height */}
      <div className="absolute inset-0 -z-10 h-screen bg-[radial-gradient(125%_125%_at_50%_90%,#ffffff_40%,#1d9bf0_100%)] transition-all duration-700 ease-in-out dark:bg-[radial-gradient(125%_125%_at_50%_90%,#15181c_40%,#2563eb_100%)]" />

      {/* Navbar */}
      <AppNavbar />

      {/* Main content */}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center">
        <div className="w-full max-w-7xl px-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
