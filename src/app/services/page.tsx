import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { serviceGroups, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="The services"
        title={
          <>
            Nutrition for every <em>body</em> and every <em>season.</em>
          </>
        }
      >
        Online first, with in-person sessions in Nairobi on request. Not sure where to start? Book the free 15-minute
        discovery call.
      </PageHero>

      <div className="sticky top-16 z-30 border-y hairline bg-black/85 backdrop-blur-md md:top-20">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
          {serviceGroups.map((g) => (
            <a key={g.slug} href={`#${g.slug}`} className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted hover:text-gold">
              <span className="font-serif text-sm italic normal-case tracking-normal text-gold">{g.numeral}</span> {g.title}
            </a>
          ))}
        </div>
      </div>

      {serviceGroups.map((g, gi) => (
        <section key={g.slug} id={g.slug} className="scroll-mt-36 border-b hairline py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-10 lg:grid-cols-[0.9fr_1.6fr]">
            <div className="reveal lg:sticky lg:top-40 lg:self-start">
              <p className="font-serif text-6xl italic text-gold">{g.numeral}</p>
              <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">{g.title}</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">{g.line}</p>
              <p className="mt-6 text-[0.6rem] font-semibold tracking-[0.3em] text-faint">
                {String(gi + 1).padStart(2, "0")} / {String(serviceGroups.length).padStart(2, "0")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.services.map((s) => (
                <article key={s.name} className="reveal group flex flex-col border hairline bg-[var(--panel)] p-7 transition-colors hover:border-green/50">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-green">{s.format}</p>
                  <h3 className="display mt-4 text-3xl">{s.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.blurb}</p>
                  <div className="mt-7 flex items-center justify-between border-t hairline pt-5">
                    <span className="font-serif text-xl text-gold">{s.price}</span>
                    <Link
                      href={`/contact?service=${encodeURIComponent(s.name)}#enquire`}
                      className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ink transition-colors group-hover:text-green"
                    >
                      Enquire →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="display reveal text-4xl md:text-6xl">
            Not sure which one <em>fits?</em>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-lg text-muted">Tell Mitchell what you&apos;re working towards and she&apos;ll recommend the right place to start.</p>
          <div className="reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink("Hi Mitchell, I'm not sure which service fits me. Can you help?")} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Ask on WhatsApp →
            </a>
            <Link href="/meal-plan" className="btn btn-ghost">
              Try the free meal plan →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
