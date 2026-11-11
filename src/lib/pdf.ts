// Builds the branded starter-plan PDF in the browser.
import type { PlanDay } from "./mealplan";
import { site } from "./site";

type Targets = { calories: number; protein: number; water: number };

async function logoDataUrl(): Promise<string | null> {
  try {
    const blob = await (await fetch("/images/logo.jpg")).blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadPlanPdf(opts: {
  name: string;
  bmi: number;
  band: string;
  goal: string;
  targets: Targets;
  plan: PlanDay[];
  tips: string[];
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const green: [number, number, number] = [91, 138, 34];
  const gold: [number, number, number] = [156, 133, 48];
  const ink: [number, number, number] = [30, 30, 26];
  const muted: [number, number, number] = [110, 108, 98];

  // Header band
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, W, 42, "F");
  const logo = await logoDataUrl();
  if (logo) doc.addImage(logo, "JPEG", 12, 3, 36, 36);
  doc.setTextColor(134, 184, 60);
  doc.setFont("times", "normal");
  doc.setFontSize(22);
  doc.text("Your Starter Meal Plan", 54, 20);
  doc.setTextColor(205, 183, 96);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Prepared for ${opts.name} · ${new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`, 54, 28);
  doc.text(site.name.toUpperCase(), 54, 34);

  let y = 54;
  // Targets
  const boxes = [
    ["BMI", `${opts.bmi.toFixed(1)}`, opts.band],
    ["Daily energy", `${opts.targets.calories}`, "kcal per day"],
    ["Protein", `${opts.targets.protein} g`, "per day"],
    ["Water", `${opts.targets.water} L`, "per day"],
  ];
  const bw = (W - 24 - 9) / 4;
  boxes.forEach(([label, value, sub], i) => {
    const x = 12 + i * (bw + 3);
    doc.setDrawColor(220, 216, 200);
    doc.roundedRect(x, y, bw, 24, 1.5, 1.5);
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.text(label.toUpperCase(), x + 4, y + 6);
    doc.setFontSize(15);
    doc.setTextColor(...ink);
    doc.text(value, x + 4, y + 15);
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(sub, x + 4, y + 20.5);
  });
  y += 32;
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Goal: ${opts.goal}`, 12, y);
  y += 8;

  const ensure = (h: number) => {
    if (y + h > 280) {
      doc.addPage();
      y = 18;
    }
  };

  opts.plan.forEach((day) => {
    ensure(20);
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(...green);
    doc.text(day.day, 12, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    day.meals.forEach((m) => {
      const detail = doc.splitTextToSize(m.detail, 128) as string[];
      const h = 7 + detail.length * 4.2;
      ensure(h);
      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.text(m.slot.toUpperCase(), 12, y + 4);
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      doc.text(m.name, 44, y + 4);
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(`~${m.kcal} kcal · ${m.portion}`, W - 12, y + 4, { align: "right" });
      doc.setFontSize(8.5);
      doc.text(detail, 44, y + 8.5);
      y += h;
      doc.setDrawColor(235, 232, 222);
      doc.line(12, y - 1.5, W - 12, y - 1.5);
    });
    y += 5;
  });

  ensure(40);
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(...green);
  doc.text("Everyday habits", 12, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...ink);
  opts.tips.forEach((t) => {
    const lines = doc.splitTextToSize(`•  ${t}`, W - 24) as string[];
    ensure(lines.length * 4.4);
    doc.text(lines, 12, y);
    y += lines.length * 4.4 + 1;
  });

  ensure(30);
  y += 4;
  doc.setFillColor(245, 243, 236);
  doc.rect(12, y, W - 24, 24, "F");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Want a plan written just for you?", 17, y + 8);
  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  doc.text(`WhatsApp or call Mitchell on ${site.phoneDisplay} · Instagram @${site.instagram}`, 17, y + 14);
  doc.text("Online sessions anywhere · in person in Nairobi on request", 17, y + 19);
  y += 30;

  ensure(14);
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(
    doc.splitTextToSize(
      "This starter plan is general guidance based on standard formulas and is not medical advice. Calorie values are estimates. If you have a medical condition, are pregnant or breastfeeding, or take medication, consult Mitchell or your doctor before changing your diet.",
      W - 24
    ),
    12,
    y
  );

  doc.save(`Nourished-by-Mitchell-Starter-Plan-${opts.name.split(" ")[0] || "You"}.pdf`);
}
