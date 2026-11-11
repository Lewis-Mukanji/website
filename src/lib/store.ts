// Phase 1 lead storage: a local JSON file (data/leads.json).
// Before going live on Vercel this is swapped for a hosted database (Supabase),
// keeping the same functions so the rest of the app does not change.
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export type Lead = {
  id: string;
  createdAt: string;
  type: "meal-plan" | "enquiry";
  name: string;
  phone: string;
  email?: string;
  service?: string;
  preferred?: string; // online / in person
  message?: string;
  summary?: string; // quiz result summary
  quiz?: Record<string, unknown>;
  status: LeadStatus;
  notes?: string;
};

const file = path.join(process.cwd(), "data", "leads.json");

async function readAll(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Lead[];
  } catch {
    return [];
  }
}

async function writeAll(leads: Lead[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export async function listLeads() {
  const leads = await readAll();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(data: Omit<Lead, "id" | "createdAt" | "status">) {
  const leads = await readAll();
  const lead: Lead = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new" };
  leads.push(lead);
  await writeAll(leads);
  return lead;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
  const leads = await readAll();
  const i = leads.findIndex((l) => l.id === id);
  if (i < 0) return null;
  leads[i] = { ...leads[i], ...patch };
  await writeAll(leads);
  return leads[i];
}
