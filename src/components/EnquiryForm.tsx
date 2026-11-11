"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { allServiceNames, whatsappLink } from "@/lib/site";

export default function EnquiryForm() {
  const params = useSearchParams();
  const initialService = params.get("service") ?? "";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: allServiceNames.includes(initialService) ? initialService : "",
    preferred: "Online",
    message: "",
    consent: false,
    website: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "whatsapp" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: "enquiry" }),
    }).catch(() => null);
    if (res?.ok) {
      setState("sent");
    } else {
      const data = await res?.json().catch(() => ({}));
      // Saving is unavailable (e.g. on the preview host): offer to send the enquiry by WhatsApp instead.
      if (data?.fallback) return setState("whatsapp");
      setError(data?.error ?? "Something went wrong. Please try WhatsApp instead.");
      setState("error");
    }
  }

  if (state === "whatsapp") {
    const text = [
      `Hi Mitchell, I'm ${form.name}.`,
      form.service && `Service: ${form.service}`,
      `Session: ${form.preferred}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    return (
      <div className="border hairline bg-[var(--panel)] p-8 text-center md:p-12">
        <p className="font-serif text-5xl italic text-green">Almost there.</p>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Tap below to send your enquiry to Mitchell on WhatsApp. Your details are already filled in.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            Send on WhatsApp →
          </a>
        </div>
      </div>
    );
  }

  if (state === "sent") {
    const msg = `Hi Mitchell, I'm ${form.name}. I just sent an enquiry on your website${form.service ? ` about ${form.service}` : ""}.`;
    return (
      <div className="border hairline bg-[var(--panel)] p-8 text-center md:p-12">
        <p className="font-serif text-5xl italic text-green">Asante.</p>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Your enquiry has reached Mitchell. She&apos;ll get back to you shortly on {form.phone}. For a faster reply,
          send her a quick WhatsApp too.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            Message on WhatsApp →
          </a>
          <Link href="/meal-plan" className="btn btn-ghost">
            Get your free meal plan →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 border hairline bg-[var(--panel)] p-6 md:grid-cols-2 md:p-10">
      <div>
        <label className="label" htmlFor="name">Full name *</label>
        <input id="name" className="field" required value={form.name} onChange={set("name")} autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone / WhatsApp *</label>
        <input id="phone" className="field" required inputMode="tel" placeholder="07XX XXX XXX" value={form.phone} onChange={set("phone")} autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="field" value={form.email} onChange={set("email")} autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="service">Service you&apos;re interested in</label>
        <select id="service" className="field" value={form.service} onChange={set("service")}>
          <option value="">Not sure yet</option>
          {allServiceNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <span className="label">How would you like to meet?</span>
        <div className="flex flex-wrap gap-3">
          {["Online", "In person (Nairobi)", "Either"].map((o) => (
            <button type="button" key={o} className="choice" data-on={form.preferred === o} onClick={() => setForm((f) => ({ ...f, preferred: o }))}>
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="message">Tell Mitchell a little about your goals</label>
        <textarea id="message" rows={5} className="field resize-y" value={form.message} onChange={set("message")} placeholder="e.g. I want to lose 10kg before December, and I have high blood pressure." />
      </div>
      <input type="text" name="website" value={form.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <label className="flex items-start gap-3 text-sm text-muted md:col-span-2">
        <input type="checkbox" className="mt-1 accent-[var(--green)]" checked={form.consent} onChange={set("consent")} required />
        <span>
          I agree to Nourished by Mitchell storing these details to contact me about my enquiry. See the{" "}
          <Link href="/privacy" className="underline hover:text-ink">privacy policy</Link>.
        </span>
      </label>
      {error && <p className="text-sm text-red-400 md:col-span-2">{error}</p>}
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send enquiry →"}
        </button>
      </div>
    </form>
  );
}
