import type { Metadata } from "next";
import { Suspense } from "react";
import EnquiryForm from "@/components/EnquiryForm";
import PageHero from "@/components/PageHero";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact & Enquiries" };

const channels = [
  { label: "WhatsApp", value: site.phoneDisplay, href: whatsappLink(), note: "Fastest reply", external: true },
  { label: "Call", value: site.phoneDisplay, href: `tel:+${site.phoneIntl}`, note: "Mon–Sat, working hours", external: false },
  { label: "Instagram", value: `@${site.instagram}`, href: site.instagramUrl, note: "Tips, recipes & DMs", external: true },
  ...(site.email ? [{ label: "Email", value: site.email, href: `mailto:${site.email}`, note: "For corporate enquiries", external: false }] : []),
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s talk about <em>you.</em>
          </>
        }
      >
        Send an enquiry, or reach Mitchell directly for a one-on-one conversation. Sessions are online by default; in
        person in Nairobi on request.
      </PageHero>

      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-px border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="reveal group bg-black p-8 transition-colors hover:bg-[var(--panel)]"
            >
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold">{c.label}</p>
              <p className="display mt-4 text-3xl transition-colors group-hover:text-green">{c.value}</p>
              <p className="mt-2 text-sm text-faint">{c.note}</p>
            </a>
          ))}
        </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-10 lg:grid-cols-[0.8fr_1.6fr]">
          <div>
            <p className="eyebrow">Enquiry</p>
            <h2 className="display mt-6 text-4xl md:text-6xl">
              Book or <em>ask.</em>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">
              Tell Mitchell what you need and how you&apos;d like to meet. She&apos;ll confirm a time and share payment
              details.
            </p>
            <div className="mt-8 border-l-2 border-gold pl-5 text-sm text-muted">
              <p className="text-ink">Paying for a session?</p>
              <p className="mt-1">M-Pesa: send to {site.mpesa}. Card and other options are coming soon.</p>
            </div>
          </div>
          <Suspense>
            <EnquiryForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
