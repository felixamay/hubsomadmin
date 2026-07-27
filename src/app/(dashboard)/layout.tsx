import { AdminShell } from "@/components/layout/AdminShell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
