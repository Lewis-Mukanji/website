import type { Metadata } from "next";
import Link from "next/link";
import Portrait from "@/components/Portrait";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About Mitchell" };

// DRAFT BIO: edit freely. Items in [brackets] need Mitchell's real details.
const values = [
  { title: "Real food first", text: "Ugali, githeri, sukuma, matoke. Healthy eating should look like your kitchen, not someone else's." },
  { title: "Personal, never generic", text: "Your body, your history, your budget and your schedule shape every plan." },
  { title: "Science you can trust", text: "Evidence-based guidance, explained simply, with no fads and no false promises." },
  { title: "Kindness over guilt", text: "Progress, not perfection. Food should bring peace, not stress." },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 md:pt-24">
        <div className="dust pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-5 md:px-10 lg:grid-cols-[1fr_1fr]">
          <div className="pb-4 lg:pb-24">
            <p className="eyebrow rise">The nutritionist</p>
            <h1 className="display rise rise-1 mt-6 text-6xl md:text-8xl">
              Hello,
              <br />
              I&apos;m <em>Mitchell.</em>
            </h1>
            <p className="rise rise-2 mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">
              Nutritionist · Founder, {site.name}
            </p>
          </div>
          <div className="rise rise-2 mx-auto w-full max-w-[520px]">
            <Portrait priority />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.3fr]">
          <p className="display reveal text-3xl md:text-5xl">
            &ldquo;I believe food should <em>heal</em>, <em>energise</em> and bring <em>joy</em>, not guilt.&rdquo;
          </p>
          <div className="reveal space-y-6 leading-relaxed text-muted">
            <p>
              I&apos;m a nutritionist based in Nairobi, and I started Nourished by Mitchell with one simple belief:
              everyone deserves to understand their body and feel good in it. Too many people are stuck between fad
              diets, confusing advice online and the pressure to give up the foods they grew up with.
            </p>
            <p>
              My work sits where science meets everyday Kenyan life. Whether you want to lose weight, manage diabetes or
              high blood pressure, eat well through pregnancy, fuel your training or simply have more energy, I build a
              plan around your body, your budget, your culture and your schedule, and I walk with you until it becomes
              second nature.
            </p>
            <p>
              I work with individuals, families and organisations, mostly online so you can join from anywhere, and in
              person in Nairobi when you prefer to meet face to face.
            </p>
            <div className="border-l-2 border-green pl-5 text-sm">
              <p className="text-ink">[Qualification, e.g. BSc Food, Nutrition & Dietetics, University name]</p>
              <p className="mt-1">
                Registered with the Kenya Nutritionists and Dieticians Institute (KNDI)
                {site.kndiNumber ? ` · Reg. No. ${site.kndiNumber}` : " · Reg. No. [to add]"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow reveal">The approach</p>
          <h2 className="display reveal mt-6 text-5xl md:text-7xl">
            What I <em>stand for.</em>
          </h2>
          <div className="mt-14 grid gap-px border hairline bg-[var(--line)] md:grid-cols-2">
            {values.map((v, i) => (
              <div key={v.title} className="reveal bg-black p-8 md:p-12">
                <p className="font-serif text-3xl italic text-gold">{["I", "II", "III", "IV"][i]}</p>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.2em]">{v.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-16 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact#enquire" className="btn btn-gold">
              Work with me <span aria-hidden>→</span>
            </Link>
            <Link href="/services" className="btn btn-ghost">
              See services <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
