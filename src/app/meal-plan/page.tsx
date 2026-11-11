import type { Metadata } from "next";
import MealPlanQuiz from "@/components/MealPlanQuiz";

export const metadata: Metadata = {
  title: "Free Starter Meal Plan",
  description: "Get your BMI, daily calorie and protein targets, and a free 3-day Kenyan meal plan in 2 minutes.",
};

export default function MealPlanPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="glow-green breathe pointer-events-none absolute left-1/2 top-20 h-[520px] w-[820px] -translate-x-1/2" />
      <div className="dust pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 text-center">
          <p className="eyebrow center rise justify-center">The free plan</p>
          <h1 className="display rise rise-1 mt-6 text-5xl md:text-7xl">
            Your starter plan, <em>in 2 minutes.</em>
          </h1>
          <p className="rise rise-2 mx-auto mt-6 max-w-xl text-muted">
            Answer a few questions and get your BMI, daily targets and a 3-day meal plan built from Kenyan foods.
          </p>
        </div>
        <div className="rise rise-3">
          <MealPlanQuiz />
        </div>
      </div>
    </section>
  );
}
