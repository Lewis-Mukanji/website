"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/store";

const statusStyle: Record<LeadStatus, string> = {
  new: "border-gold text-gold",
  contacted: "border-sky-400/60 text-sky-300",
  converted: "border-green text-green",
  closed: "border-white/20 text-faint",
};

function waNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("254")) return d;
  if (d.startsWith("0")) return "254" + d.slice(1);
  if (d.length === 9) return "254" + d;
  return d;
}

export default function AdminDashboard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<"all" | LeadStatus | "meal-plan" | "enquiry">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      "meal-plan": leads.filter((l) => l.type === "meal-plan").length,
      enquiry: leads.filter((l) => l.type === "enquiry").length,
      converted: leads.filter((l) => l.status === "converted").length,
    }),
    [leads]
  );

  const shown = leads.filter((l) => {
    if (filter === "meal-plan" || filter === "enquiry") {
      if (l.type !== filter) return false;
    } else if (filter !== "all" && l.status !== filter) return false;
    if (q) {
      const s = `${l.name} ${l.phone} ${l.email ?? ""} ${l.service ?? ""} ${l.summary ?? ""} ${l.message ?? ""}`.toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  async function patch(id: string, body: { status?: LeadStatus; notes?: string }) {
    const res = await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) });
    if (res.ok) {
      const { lead } = await res.json();
      setLeads((ls) => ls.map((l) => (l.id === id ? lead : l)));
    }
  }

  async function refresh() {
    const res = await fetch("/api/admin/leads");
    if (res.ok) setLeads((await res.json()).leads);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b hairline bg-black/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span className="relative block h-10 w-10 overflow-hidden">
              <Image src="/images/logo.jpg" alt="" fill sizes="40px" className="object-cover scale-[1.55] object-[50%_40%]" />
            </span>
            <span className="display text-2xl">Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
            <Link href="/" className="text-muted hover:text-ink">View site</Link>
            <button onClick={refresh} className="text-muted hover:text-ink">Refresh</button>
            <button onClick={logout} className="text-muted hover:text-ink">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10">
        <div className="grid gap-px border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "New leads", v: counts.new, c: "text-gold" },
            { k: "Meal plan quizzes", v: counts["meal-plan"], c: "text-ink" },
            { k: "Enquiries", v: counts.enquiry, c: "text-ink" },
            { k: "Converted to clients", v: counts.converted, c: "text-green" },
          ].map((s) => (
            <div key={s.k} className="bg-black p-6">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted">{s.k}</p>
              <p className={`display mt-2 text-5xl ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "new", "contacted", "converted", "closed", "meal-plan", "enquiry"] as const).map((f) => (
              <button key={f} className="choice !px-3 !py-2 text-xs capitalize" data-on={filter === f} onClick={() => setFilter(f)}>
                {f.replace("-", " ")}
              </button>
            ))}
          </div>
          <input className="field md:max-w-xs" placeholder="Search name, phone, goal…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="mt-6 divide-y divide-[var(--line)] border hairline">
          {shown.length === 0 && <p className="p-10 text-center text-muted">No leads here yet. New quiz results and enquiries will appear here.</p>}
          {shown.map((l) => {
            const open = openId === l.id;
            const referral = !!(l.quiz as { referral?: boolean } | undefined)?.referral;
            return (
              <div key={l.id} className="bg-black">
                <button className="flex w-full flex-col gap-2 p-5 text-left md:flex-row md:items-center md:gap-6" onClick={() => setOpenId(open ? null : l.id)}>
                  <span className={`w-fit shrink-0 border px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] ${statusStyle[l.status]}`}>{l.status}</span>
                  <span className="flex-1">
                    <span className="font-semibold text-ink">{l.name}</span>
                    <span className="ml-3 text-sm text-muted">{l.phone}</span>
                    {referral && <span className="ml-3 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-red-300">Needs personal plan</span>}
                    <span className="mt-1 block text-sm text-faint">
                      {l.type === "meal-plan" ? "Meal plan quiz" : `Enquiry${l.service ? ` · ${l.service}` : ""}`}
                      {l.preferred ? ` · ${l.preferred}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-faint">
                    {new Date(l.createdAt).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </button>
                {open && (
                  <div className="grid gap-6 border-t hairline bg-[var(--panel)] p-5 md:grid-cols-[1.4fr_1fr]">
                    <div className="space-y-4 text-sm">
                      {l.summary && (
                        <div>
                          <p className="label">Quiz summary</p>
                          <p className="text-muted">{l.summary}</p>
                        </div>
                      )}
                      {l.message && (
                        <div>
                          <p className="label">Message</p>
                          <p className="whitespace-pre-wrap text-muted">{l.message}</p>
                        </div>
                      )}
                      {l.email && (
                        <div>
                          <p className="label">Email</p>
                          <a className="text-gold underline" href={`mailto:${l.email}`}>{l.email}</a>
                        </div>
                      )}
                      <div>
                        <p className="label">Private notes</p>
                        <textarea
                          className="field"
                          rows={3}
                          defaultValue={l.notes ?? ""}
                          placeholder="e.g. Called 12 Nov, booking for Friday"
                          onBlur={(e) => e.target.value !== (l.notes ?? "") && patch(l.id, { notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <a
                        className="btn btn-gold w-full"
                        href={`https://wa.me/${waNumber(l.phone)}?text=${encodeURIComponent(`Hi ${l.name.split(" ")[0]}, this is Mitchell from Nourished by Mitchell. Thank you for reaching out!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp {l.name.split(" ")[0]}
                      </a>
                      <a className="btn btn-ghost w-full" href={`tel:${l.phone}`}>Call</a>
                      <p className="label pt-3">Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(["new", "contacted", "converted", "closed"] as LeadStatus[]).map((s) => (
                          <button key={s} className="choice !py-2 text-xs capitalize" data-on={l.status === s} onClick={() => patch(l.id, { status: s })}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
