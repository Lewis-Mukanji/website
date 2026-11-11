import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listLeads, updateLead, type LeadStatus } from "@/lib/store";

const statuses: LeadStatus[] = ["new", "contacted", "converted", "closed"];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ leads: await listLeads() });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { id?: string; status?: LeadStatus; notes?: string };
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const patch: { status?: LeadStatus; notes?: string } = {};
  if (body.status && statuses.includes(body.status)) patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes.slice(0, 3000);
  const lead = await updateLead(body.id, patch);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead });
}
