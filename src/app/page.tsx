import Image from "next/image";
import Link from "next/link";
import Portrait from "@/components/Portrait";
import ScrollLitText from "@/components/ScrollLitText";
import ServicesRail from "@/components/ServicesRail";
import { site, whatsappLink } from "@/lib/site";

const steps = [
  { n: "01", title: "Tell us about you", text: "A 2-minute quiz: your body, your goal, the foods you love and the ones you avoid." },
  { n: "02", title: "Get your starter plan", text: "BMI, daily calories, protein and a 3-day Kenyan meal plan, instantly and free." },
  { n: "03", title: "Meet Mitchell", text: "Book a consultation online or in person for a plan written just for you." },
  { n: "04", title: "Stay nourished", text: "Coaching, check-ins and adjustments until the new way of eating feels natural." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="dust pointer-events-none absolute inset-0" />
        <div className="glow-gold pointer-events-none absolute -left-40 top-10 h-[600px] w-[600px] opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-6 px-5 pt-28 md:px-10 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="pb-6 lg:pb-28">
            <p className="eyebrow rise">Nairobi · Online & in person</p>
            <h1 className="display rise rise-1 mt-7 text-[3.4rem] sm:text-7xl lg:text-[6.4rem]">
              Eat well.
              <br />
              Live <em>nourished.</em>
            </h1>
            <p className="rise rise-2 mt-7 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Personalised meal plans, nutrition coaching and clinical nutrition from Mitchell: real food, Kenyan
              staples, and a plan built around your life.
            </p>
            <div className="rise rise-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/meal-plan" className="btn btn-gold">
                Get your free meal plan <span aria-hidden>→</span>
              </Link>
              <Link href="/contact#enquire" className="btn btn-ghost">
                Book a consultation <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="rise rise-4 mt-12 flex flex-wrap gap-x-8 gap-y-2 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-faint">
              <span>Meal plans</span>
              <span>Coaching</span>
              <span>Clinical nutrition</span>
              <span>Corporate wellness</span>
            </div>
          </div>
          <div className="rise rise-2 relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <Portrait priority />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="relative py-24 md:py-40">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow reveal">The philosophy</p>
          <ScrollLitText
            className="mt-10 max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            parts={[
              { text: "Food is not the enemy. It is the" },
              { text: "medicine", accent: true },
              { text: "you take three times a day. Eaten with intention, it changes how you feel, how you move and" },
              { text: "how you live.", accent: true },
            ]}
          />
          <p className="reveal mt-12 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            No fad diets, no starving, no giving up ugali. Mitchell works with the food you already know and love, and
            shows you how to eat it in a way that serves your body and your goals.
          </p>
        </div>
      </section>

      {/* THE NUTRITIONIST */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
          <div className="reveal relative mx-auto aspect-square w-full max-w-md">
            <div className="glow-green breathe absolute inset-0" />
            <Image src="/images/logo.jpg" alt={`${site.name} logo`} fill sizes="(min-width:1024px) 40vw, 80vw" className="object-contain" />
          </div>
          <div>
            <p className="eyebrow reveal">The nutritionist</p>
            <h2 className="display reveal mt-6 text-5xl md:text-7xl">
              Meet <em>Mitchell.</em>
            </h2>
            <p className="reveal mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">
              Nutritionist · Founder, Nourished by Mitchell
            </p>
            <p className="reveal mt-8 max-w-xl leading-relaxed text-muted">
              Mitchell is a Nairobi-based nutritionist who believes healthy eating should feel like nourishment, not
              punishment. She helps busy professionals, families, new mothers and people managing conditions like
              diabetes, high blood pressure and PCOS build ways of eating that fit real Kenyan life.
            </p>
            <Link href="/about" className="btn btn-ghost reveal mt-10">
              Her story <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES RAIL */}
      <section className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="eyebrow reveal">The services</p>
              <h2 className="display reveal mt-6 text-5xl md:text-7xl">
                Eight ways,
                <br />
                one <em>you.</em>
              </h2>
            </div>
            <p className="reveal max-w-md text-sm leading-relaxed text-muted md:justify-self-end md:text-base">
              From a single consultation to a full corporate wellness programme. Swipe through, then choose where
              you'd like to begin.
            </p>
          </div>
        </div>
        <ServicesRail />
      </section>

      {/* FREE PLAN CTA */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="glow-gold breathe pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <p className="eyebrow center reveal justify-center">The free plan</p>
          <h2 className="display reveal mt-6 text-5xl md:text-7xl lg:text-8xl">
            Your first plan
            <br />
            is <span className="accent-gold">on us.</span>
          </h2>
          <p className="reveal mx-auto mt-8 max-w-xl leading-relaxed text-muted">
            Answer a few questions and get your BMI, daily calorie and protein targets, and a 3-day meal plan built
            from Kenyan foods. Free, instant, and yours to download.
          </p>
          <Link href="/meal-plan" className="btn btn-gold reveal mt-10">
            Start the 2-minute quiz <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow reveal">The journey</p>
          <h2 className="display reveal mt-6 text-5xl md:text-7xl">
            Four steps to <em>nourished.</em>
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden border hairline bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className={`reveal reveal-delay-${i} bg-black p-8 md:p-10`}>
                <p className="font-serif text-5xl italic text-gold">{s.n}</p>
                <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.2em]">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow reveal">The voices</p>
          <h2 className="display reveal mt-6 text-5xl md:text-7xl">
            Stories of <em>change.</em>
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <figure key={i} className={`reveal reveal-delay-${i} border hairline p-8`}>
                <p className="font-serif text-6xl leading-none text-green">“</p>
                <blockquote className="font-serif text-2xl italic leading-snug text-muted">
                  Client story coming soon. Real words from real clients, shared with their permission.
                </blockquote>
                <figcaption className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-faint">
                  Client name · Programme
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t hairline py-24 md:py-36">
        <div className="glow-green breathe pointer-events-none absolute left-1/2 top-full h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <h2 className="display reveal text-5xl md:text-7xl lg:text-8xl">
            Ready when
            <br />
            <em>you are.</em>
          </h2>
          <p className="reveal mx-auto mt-8 max-w-lg leading-relaxed text-muted">
            Sessions are online by default, so you can join from anywhere. Prefer to meet in person in Nairobi? Just
            ask.
          </p>
          <div className="reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Chat on WhatsApp <span aria-hidden>→</span>
            </a>
            <Link href="/contact#enquire" className="btn btn-ghost">
              Send an enquiry <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
