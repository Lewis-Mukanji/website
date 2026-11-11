"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  activityLabels,
  bmiBand,
  buildPlan,
  calcBmi,
  calcTargets,
  dietLabels,
  generalTips,
  goalLabels,
  healthLabels,
  needsReferral,
  type Activity,
  type Allergy,
  type Budget,
  type Diet,
  type Goal,
  type HealthFlag,
  type QuizInput,
  type Sex,
} from "@/lib/mealplan";
import { whatsappLink } from "@/lib/site";

type Form = {
  age: string;
  sex: Sex | "";
  heightCm: string;
  weightKg: string;
  activity: Activity | "";
  goal: Goal | "";
  diet: Diet;
  allergies: Allergy[];
  budget: Budget;
  health: HealthFlag[];
  noHealth: boolean;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  website: string;
};

const steps = ["About you", "Lifestyle", "Food", "Health", "Your plan"];
const allergyLabels: Record<Allergy, string> = { nuts: "Nuts / groundnuts", dairy: "Milk & dairy", egg: "Eggs", fish: "Fish", gluten: "Wheat / gluten" };

function Choice<T extends string>({ value, current, onPick, children }: { value: T; current: T | ""; onPick: (v: T) => void; children: React.ReactNode }) {
  return (
    <button type="button" className="choice text-left" data-on={current === value} onClick={() => onPick(value)}>
      {children}
    </button>
  );
}

export default function MealPlanQuiz() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>({
    age: "",
    sex: "",
    heightCm: "",
    weightKg: "",
    activity: "",
    goal: "",
    diet: "everything",
    allergies: [],
    budget: "low",
    health: [],
    noHealth: false,
    name: "",
    phone: "",
    email: "",
    consent: false,
    website: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = <T extends string>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const input: QuizInput | null = useMemo(() => {
    if (!f.sex || !f.activity || !f.goal) return null;
    return {
      age: Number(f.age),
      sex: f.sex,
      heightCm: Number(f.heightCm),
      weightKg: Number(f.weightKg),
      activity: f.activity,
      goal: f.goal,
      diet: f.diet,
      allergies: f.allergies,
      budget: f.budget,
      health: f.health,
    };
  }, [f]);

  const result = useMemo(() => {
    if (!input) return null;
    const bmi = calcBmi(input.heightCm, input.weightKg);
    const referral = needsReferral(input);
    const targets = calcTargets(input);
    const plan = referral ? [] : buildPlan(input, targets.calories);
    return { bmi, band: bmiBand(bmi), referral, targets, plan };
  }, [input]);

  function validate(): string {
    if (step === 0) {
      const age = Number(f.age), h = Number(f.heightCm), w = Number(f.weightKg);
      if (!f.sex) return "Please choose your sex.";
      if (!age || age < 10 || age > 100) return "Please enter a valid age.";
      if (!h || h < 120 || h > 220) return "Please enter your height in centimetres (e.g. 165).";
      if (!w || w < 30 || w > 250) return "Please enter your weight in kilograms (e.g. 68).";
    }
    if (step === 1) {
      if (!f.activity) return "Please choose your activity level.";
      if (!f.goal) return "Please choose your goal.";
    }
    if (step === 3 && !f.noHealth && f.health.length === 0) return "Please tick any that apply, or choose “None of these”.";
    return "";
  }

  function next() {
    const e = validate();
    setError(e);
    if (!e) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!result || !input) return;
    if (!f.name.trim() || !f.phone.trim()) return setError("Please add your name and phone number.");
    if (!f.consent) return setError("Please tick the consent box so Mitchell can contact you.");
    setError("");
    setSending(true);
    const summary = result.referral
      ? `REFERRAL. ${input.age}y ${input.sex}, BMI ${result.bmi.toFixed(1)} (${result.band.label}). Health: ${input.health.map((h) => healthLabels[h]).join(", ") || "none"}. Goal: ${goalLabels[input.goal]}.`
      : `${input.age}y ${input.sex}, ${input.heightCm}cm, ${input.weightKg}kg, BMI ${result.bmi.toFixed(1)} (${result.band.label}). Goal: ${goalLabels[input.goal]}. Target ${result.targets.calories} kcal, ${result.targets.protein} g protein. Diet: ${dietLabels[input.diet]}.`;
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "meal-plan",
        name: f.name,
        phone: f.phone,
        email: f.email,
        consent: f.consent,
        website: f.website,
        summary,
        quiz: { ...input, bmi: Number(result.bmi.toFixed(1)), ...result.targets, referral: !!result.referral },
      }),
    }).catch(() => null);
    setSending(false);
    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      // If saving is unavailable (e.g. on the preview host), still show the plan.
      if (!data?.fallback) return setError(data?.error ?? "Something went wrong. Please try again.");
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function pdf() {
    if (!result || !input) return;
    setPdfBusy(true);
    const { downloadPlanPdf } = await import("@/lib/pdf");
    await downloadPlanPdf({
      name: f.name,
      bmi: result.bmi,
      band: result.band.label,
      goal: goalLabels[input.goal],
      targets: result.targets,
      plan: result.plan,
      tips: generalTips,
    });
    setPdfBusy(false);
  }

  // ---------------- RESULTS ----------------
  if (done && result && input) {
    const firstName = f.name.trim().split(" ")[0];
    if (result.referral) {
      return (
        <div className="mx-auto max-w-3xl border hairline bg-[var(--panel)] p-8 md:p-14">
          <p className="eyebrow">Your result</p>
          <h2 className="display mt-6 text-4xl md:text-6xl">
            {firstName}, you deserve a <em>personal</em> plan.
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Based on your answers, an automatic plan wouldn&apos;t be safe or accurate enough for you. Mitchell will
            create one around your health and needs.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {result.referral.reasons.map((r) => (
              <li key={r} className="border-l-2 border-gold pl-4">{r}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Your BMI is <span className="text-ink">{result.bmi.toFixed(1)}</span> ({result.band.label}). Mitchell has
            received your details and will reach out on {f.phone}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(`Hi Mitchell, I'm ${f.name}. I just did the meal plan quiz on your website and would like a personal plan.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              Message Mitchell now →
            </a>
            <Link href="/contact?service=Initial%20Consultation%20%26%20Assessment#enquire" className="btn btn-ghost">
              Book a consultation →
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="text-center">
          <p className="eyebrow center justify-center">Your starter plan</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            Here you go, <em>{firstName}.</em>
          </h2>
        </div>

        <div className="mt-12 grid gap-px border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "BMI", v: result.bmi.toFixed(1), s: result.band.label },
            { k: "Daily energy", v: `${result.targets.calories}`, s: "kcal per day" },
            { k: "Protein", v: `${result.targets.protein} g`, s: "per day" },
            { k: "Water", v: `${result.targets.water} L`, s: "per day" },
          ].map((x) => (
            <div key={x.k} className="bg-black p-7">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold">{x.k}</p>
              <p className="display mt-3 text-5xl">{x.v}</p>
              <p className="mt-1 text-sm text-faint">{x.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted">{result.band.note} Goal: {goalLabels[input.goal]}.</p>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {result.plan.map((day) => (
            <div key={day.day} className="border hairline bg-[var(--panel)] p-6 md:p-8">
              <p className="font-serif text-3xl italic text-green">{day.day}</p>
              <ul className="mt-6 space-y-6">
                {day.meals.map((m) => (
                  <li key={m.slot}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-gold">{m.slot}</span>
                      <span className="text-[0.65rem] text-faint">~{m.kcal} kcal</span>
                    </div>
                    <p className="mt-1 font-semibold text-ink">{m.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{m.detail}</p>
                    <p className="mt-1 text-xs text-green">{m.portion}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border hairline p-6 md:p-8">
          <p className="eyebrow">Everyday habits</p>
          <ul className="mt-6 grid gap-3 text-sm text-muted md:grid-cols-2">
            {generalTips.map((t) => (
              <li key={t} className="border-l-2 border-green pl-4">{t}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button onClick={pdf} className="btn btn-gold" disabled={pdfBusy}>
            {pdfBusy ? "Preparing PDF…" : "Download my plan (PDF) ↓"}
          </button>
          <Link href="/contact?service=Personalised%20Meal%20Plan#enquire" className="btn btn-ghost">
            Get a plan made for me →
          </Link>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-faint">
          This starter plan is general guidance based on standard formulas (Mifflin-St Jeor) and is not medical advice.
          Calorie values are estimates. For a plan tailored to your health, medication and lifestyle, book a
          consultation with Mitchell.
        </p>
      </div>
    );
  }

  // ---------------- QUIZ ----------------
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold">
          Step {step + 1} of {steps.length} · {steps[step]}
        </p>
        <p className="text-[0.6rem] tracking-[0.3em] text-faint">
          {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </p>
      </div>
      <div className="mt-4 h-px w-full bg-white/10">
        <div className="h-px bg-gradient-to-r from-green to-gold transition-all duration-700" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      <div className="mt-10 border hairline bg-[var(--panel)] p-6 md:p-10">
        {step === 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <h2 className="display text-4xl md:col-span-2">Tell us about <em>you.</em></h2>
            <div className="md:col-span-2">
              <span className="label">Sex</span>
              <div className="grid grid-cols-2 gap-3">
                <Choice value="female" current={f.sex} onPick={(v) => set("sex", v)}>Female</Choice>
                <Choice value="male" current={f.sex} onPick={(v) => set("sex", v)}>Male</Choice>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="age">Age (years)</label>
              <input id="age" className="field" inputMode="numeric" value={f.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 29" />
            </div>
            <div>
              <label className="label" htmlFor="h">Height (cm)</label>
              <input id="h" className="field" inputMode="decimal" value={f.heightCm} onChange={(e) => set("heightCm", e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 165" />
            </div>
            <div>
              <label className="label" htmlFor="w">Weight (kg)</label>
              <input id="w" className="field" inputMode="decimal" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 68" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <h2 className="display text-4xl">Your <em>lifestyle.</em></h2>
            <div>
              <span className="label">How active are you?</span>
              <div className="grid gap-3">
                {(Object.keys(activityLabels) as Activity[]).map((a) => (
                  <Choice key={a} value={a} current={f.activity} onPick={(v) => set("activity", v)}>{activityLabels[a]}</Choice>
                ))}
              </div>
            </div>
            <div>
              <span className="label">Your main goal</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(goalLabels) as Goal[]).map((g) => (
                  <Choice key={g} value={g} current={f.goal} onPick={(v) => set("goal", v)}>{goalLabels[g]}</Choice>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="display text-4xl">Your <em>food.</em></h2>
            <div>
              <span className="label">What do you eat?</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(dietLabels) as Diet[]).map((d) => (
                  <Choice key={d} value={d} current={f.diet} onPick={(v) => set("diet", v)}>{dietLabels[d]}</Choice>
                ))}
              </div>
            </div>
            <div>
              <span className="label">Allergies or foods you avoid (tick any)</span>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(allergyLabels) as Allergy[]).map((a) => (
                  <button type="button" key={a} className="choice" data-on={f.allergies.includes(a)} onClick={() => set("allergies", toggle(f.allergies, a))}>
                    {allergyLabels[a]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label">Food budget</span>
              <div className="grid grid-cols-2 gap-3">
                <Choice value="low" current={f.budget} onPick={(v) => set("budget", v)}>Keep it affordable</Choice>
                <Choice value="medium" current={f.budget} onPick={(v) => set("budget", v)}>Flexible</Choice>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="display text-4xl">A quick <em>health check.</em></h2>
            <p className="text-sm leading-relaxed text-muted">
              This keeps you safe. If any of these apply, Mitchell will prepare your plan personally instead of the
              automatic one.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(healthLabels) as HealthFlag[]).map((h) => (
                <button
                  type="button"
                  key={h}
                  className="choice text-left"
                  data-on={f.health.includes(h)}
                  onClick={() => setF((p) => ({ ...p, health: toggle(p.health, h), noHealth: false }))}
                >
                  {healthLabels[h]}
                </button>
              ))}
              <button
                type="button"
                className="choice text-left sm:col-span-2"
                data-on={f.noHealth}
                onClick={() => setF((p) => ({ ...p, noHealth: !p.noHealth, health: [] }))}
              >
                None of these apply to me
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
            <h2 className="display text-4xl md:col-span-2">Where should we <em>send it?</em></h2>
            <p className="text-sm text-muted md:col-span-2">Your plan appears right away. Mitchell may follow up to see how you&apos;re getting on.</p>
            <div>
              <label className="label" htmlFor="qn">Full name *</label>
              <input id="qn" className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required />
            </div>
            <div>
              <label className="label" htmlFor="qp">Phone / WhatsApp *</label>
              <input id="qp" className="field" inputMode="tel" placeholder="07XX XXX XXX" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" required />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="qe">Email (optional)</label>
              <input id="qe" type="email" className="field" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
            </div>
            <input type="text" value={f.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <label className="flex items-start gap-3 text-sm text-muted md:col-span-2">
              <input type="checkbox" className="mt-1 accent-[var(--green)]" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
              <span>
                I agree to Nourished by Mitchell storing my answers, including health information, to prepare my plan
                and contact me. See the <Link href="/privacy" className="underline hover:text-ink">privacy policy</Link>.
              </span>
            </label>
            {error && <p className="text-sm text-red-400 md:col-span-2">{error}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between md:col-span-2">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
              <button type="submit" className="btn btn-gold" disabled={sending}>{sending ? "Preparing…" : "Show my plan →"}</button>
            </div>
          </form>
        )}

        {step < 4 && (
          <>
            {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => { setError(""); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0}>
                ← Back
              </button>
              <button type="button" className="btn btn-gold" onClick={next}>Continue →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
