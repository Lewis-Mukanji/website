import { NextResponse } from "next/server";
import { addLead } from "@/lib/store";

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160);
  if (!name || !phone) return NextResponse.json({ error: "Please add your name and phone number." }, { status: 400 });
  if (!/^[+\d\s()-]{9,20}$/.test(phone)) return NextResponse.json({ error: "Please check your phone number." }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Please check your email address." }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: "Please agree to be contacted." }, { status: 400 });

  const type = body.type === "meal-plan" ? "meal-plan" : "enquiry";
  let lead;
  try {
    lead = await addLead({
      type,
      name,
      phone,
      email: email || undefined,
      service: clean(body.service, 160) || undefined,
      preferred: clean(body.preferred, 40) || undefined,
      message: clean(body.message, 3000) || undefined,
      summary: clean(body.summary, 600) || undefined,
      quiz: typeof body.quiz === "object" && body.quiz ? (body.quiz as Record<string, unknown>) : undefined,
    });
  } catch {
    // Hosts like Vercel cannot write to local files. Until leads move to a database,
    // tell the page so it can fall back to WhatsApp instead of failing.
    return NextResponse.json({ error: "We could not save this right now.", fallback: true }, { status: 503 });
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
