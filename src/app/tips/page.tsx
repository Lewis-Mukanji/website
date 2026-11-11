import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Tips & Recipes" };

// Starter content. Mitchell can replace or add to these.
const posts = [
  {
    tag: "Everyday eating",
    title: "Build a balanced Kenyan plate",
    body: "Half your plate vegetables (sukuma, managu, cabbage), a quarter protein (beans, ndengu, fish, eggs, lean meat), a quarter starch (brown ugali, sweet potato, brown rice). Add a little healthy fat like avocado.",
  },
  {
    tag: "Recipe",
    title: "Lighter githeri in 30 minutes",
    body: "Use pre-boiled maize and beans. Sauté onions, tomatoes and carrots in a teaspoon of oil, add the githeri, a handful of spinach and dhania. Season with a pinch of salt and black pepper.",
  },
  {
    tag: "Blood sugar",
    title: "Three swaps that steady blood sugar",
    body: "Swap white ugali for brown or mixed-flour ugali, soda for water with lemon, and white bread for sweet potato or arrowroot at breakfast.",
  },
  {
    tag: "Hydration",
    title: "How much water do you really need?",
    body: "A simple guide is about 30–35 ml per kg of body weight daily, more in hot weather or when you exercise. Thirst, energy and urine colour are your best signals.",
  },
  {
    tag: "Recipe",
    title: "Ndengu stew, the protein hero",
    body: "Boil green grams until soft. Fry onion, garlic and tomato, add a pinch of turmeric and cumin, stir in the ndengu with a little of the cooking water. Serve with brown rice or chapati.",
  },
  {
    tag: "Busy days",
    title: "Healthy eating on a Nairobi workday",
    body: "Pack leftovers, keep fruit and groundnuts in your bag, and choose a githeri, beans or fish plate over chips when eating out.",
  },
];

export default function Tips() {
  return (
    <>
      <PageHero
        eyebrow="Tips & recipes"
        title={
          <>
            Small changes, <em>big difference.</em>
          </>
        }
      >
        Simple, practical nutrition for real Kenyan kitchens. Follow{" "}
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
          @{site.instagram}
        </a>{" "}
        for more.
      </PageHero>
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p.title} className="reveal flex flex-col border hairline bg-[var(--panel)] p-8">
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-green">{p.tag}</span>
                <span className="text-[0.6rem] tracking-[0.3em] text-faint">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="display mt-6 text-3xl">{p.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.body}</p>
            </article>
          ))}
        </div>
        <div className="reveal mx-auto mt-16 max-w-3xl px-5 text-center">
          <Link href="/meal-plan" className="btn btn-gold">
            Get your free starter plan →
          </Link>
        </div>
      </section>
    </>
  );
}
