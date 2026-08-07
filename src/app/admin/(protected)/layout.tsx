import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = token ? await verifyAdminSessionToken(token) : false;

  if (!isValid) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
