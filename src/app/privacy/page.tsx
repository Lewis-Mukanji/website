import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

// Draft policy written with Kenya's Data Protection Act, 2019 in mind.
// Have it reviewed before launch.
export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Your data" title={<>Privacy <em>policy.</em></>}>
        How {site.name} collects, uses and protects your information.
      </PageHero>
      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-8 px-5 leading-relaxed text-muted md:px-10">
          <div>
            <h2 className="display text-3xl text-ink">What we collect</h2>
            <p className="mt-3">Your name, phone number and email; details you share in enquiries; and, if you use the free meal plan, your age, sex, height, weight, activity level, goals, food preferences, allergies and any health conditions you tell us about.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-ink">Why we collect it</h2>
            <p className="mt-3">To respond to your enquiry, prepare your meal plan, and provide the nutrition services you ask for. We do not sell or share your information with third parties for marketing.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-ink">Health information</h2>
            <p className="mt-3">Health details are sensitive personal data under Kenya&apos;s Data Protection Act, 2019. We collect them only with your consent, use them only to guide your nutrition care, and keep them secure with access limited to Mitchell.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-ink">Your rights</h2>
            <p className="mt-3">You can ask to see, correct or delete your information at any time by contacting us on WhatsApp or by phone at {site.phoneDisplay}.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-ink">Medical disclaimer</h2>
            <p className="mt-3">The free starter meal plan and the content on this website are general guidance, not medical advice or a diagnosis. Always consult a qualified professional about medical conditions, pregnancy or medication.</p>
          </div>
        </div>
      </section>
    </>
  );
}
