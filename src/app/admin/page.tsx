import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/store";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const leads = await listLeads();
  return <AdminDashboard initialLeads={leads} />;
}
