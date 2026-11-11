import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  { q: "How do online sessions work?", a: "After you book, you receive a Google Meet or Zoom link. You join from your phone or laptop, wherever you are. Meal plans and notes are shared by email or WhatsApp." },
  { q: "Can I meet Mitchell in person?", a: "Yes. Sessions are online by default, but in-person consultations in Nairobi are available on request. Mention it when you enquire and Mitchell will confirm a venue and time." },
  { q: "How do I pay?", a: `Right now you can pay by M-Pesa to ${site.mpesa}. Card payments, Airtel Money and PayPal are coming soon, so you'll be able to pay securely when you book online.` },
  { q: "Is the free meal plan enough on its own?", a: "The free plan is a helpful starting point based on general guidelines. It does not replace a consultation. For a plan built around your health history, medication, conditions and lifestyle, book a session with Mitchell." },
  { q: "Why wasn't I given an automatic plan?", a: "If you are under 18, pregnant or breastfeeding, or have a medical condition such as diabetes, high blood pressure, or kidney, liver or heart disease, a generic plan could do more harm than good. In those cases Mitchell creates your plan personally." },
  { q: "Will I have to give up foods I love?", a: "Almost never. Mitchell works with Kenyan staples like ugali, chapati, rice and githeri, and shows you how to balance portions and combinations rather than cutting foods out." },
  { q: "How soon will I see results?", a: "Most clients feel more energy and better digestion within 2–3 weeks. Weight and health markers change steadily over 6–12 weeks with consistency." },
  { q: "Do you work with companies and schools?", a: "Yes: wellness talks, staff health screening days, monthly programmes and sessions for schools, gyms and churches. Use the enquiry form or WhatsApp for a quote." },
  { q: "What is your cancellation policy?", a: "Please give at least 24 hours' notice to reschedule. [Mitchell to confirm her full cancellation and refund policy.]" },
];

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Questions"
        title={
          <>
            Good questions, <em>honest answers.</em>
          </>
        }
      />
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <div className="border-t hairline">
            {faqs.map((f, i) => (
              <details key={f.q} className="reveal group border-b hairline py-6">
                <summary className="flex cursor-pointer list-none items-baseline gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 text-[0.6rem] font-semibold tracking-[0.3em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display flex-1 text-2xl md:text-3xl">{f.q}</span>
                  <span className="text-2xl text-green transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 pl-14 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="reveal mt-16 text-center">
            <p className="text-muted">Still wondering about something?</p>
            <a href={whatsappLink("Hi Mitchell, I have a question:")} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6">
              Ask Mitchell on WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
