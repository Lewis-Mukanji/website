// Hosted lead storage. The local JSON fallback is for development only.
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

function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (url && key) {
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) {
      throw new Error("SUPABASE_URL must be an HTTPS project URL.");
    }
    return { url: endpoint.origin, key };
  }
  if (url || key || process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error("Hosted lead storage is not configured.");
  }
  return null;
}

async function queryLeads(config: { url: string; key: string }, query: string, method = "GET", body?: unknown): Promise<Lead[]> {
  const response = await fetch(`${config.url}/rest/v1/leads?${query}`, {
    method,
    headers: {
      apikey: config.key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  // Do not include response bodies or credentials in errors: leads contain private data.
  if (!response.ok) throw new Error(`Hosted lead storage request failed (${response.status}).`);
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Unexpected hosted lead storage response.");
  return result as Lead[];
}

async function readAll(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Lead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(leads: Lead[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export async function listLeads() {
  const config = database();
  if (config) {
    // PostgREST defaults to 1,000 rows; page so older enquiries remain visible.
    const leads: Lead[] = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const page = await queryLeads(config, `select=*&order=createdAt.desc,id.desc&limit=${pageSize}&offset=${offset}`);
      leads.push(...page);
      if (page.length < pageSize) return leads;
    }
  }
  const leads = await readAll();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(data: Omit<Lead, "id" | "createdAt" | "status">) {
  const lead: Lead = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new" };
  const config = database();
  if (config) {
    const rows = await queryLeads(config, "select=*", "POST", lead);
    if (!rows[0]) throw new Error("Hosted lead storage did not confirm the saved lead.");
    return rows[0];
  }
  const leads = await readAll();
  leads.push(lead);
  await writeAll(leads);
  return lead;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
  const config = database();
  if (config) {
    const values = {
      ...(patch.status === undefined ? {} : { status: patch.status }),
      ...(patch.notes === undefined ? {} : { notes: patch.notes }),
    };
    const rows = await queryLeads(config, `id=eq.${encodeURIComponent(id)}&select=*`, "PATCH", values);
    return rows[0] ?? null;
  }
  const leads = await readAll();
  const i = leads.findIndex((l) => l.id === id);
  if (i < 0) return null;
  leads[i] = { ...leads[i], ...patch };
  await writeAll(leads);
  return leads[i];
}
