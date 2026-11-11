// Starter meal plan engine.
// Calculates BMI and daily energy needs (Mifflin-St Jeor), applies safety rules,
// and builds a 3-day plan from a Kenyan food list that Mitchell can edit below.

export type Sex = "female" | "male";
export type Activity = "sedentary" | "light" | "moderate" | "very";
export type Goal = "lose" | "maintain" | "gain" | "muscle";
export type Diet = "everything" | "no-pork" | "pescatarian" | "vegetarian" | "vegan";
export type Allergy = "nuts" | "dairy" | "egg" | "fish" | "gluten";
export type Budget = "low" | "medium";

export type HealthFlag =
  | "pregnant"
  | "breastfeeding"
  | "diabetes"
  | "hypertension"
  | "kidney"
  | "liver"
  | "heart"
  | "eating-disorder"
  | "other";

export type QuizInput = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  diet: Diet;
  allergies: Allergy[];
  budget: Budget;
  health: HealthFlag[];
};

export const activityLabels: Record<Activity, string> = {
  sedentary: "Mostly sitting (office, little exercise)",
  light: "Lightly active (walking, exercise 1–3 days a week)",
  moderate: "Active (exercise 3–5 days a week)",
  very: "Very active (hard training or physical job)",
};

export const goalLabels: Record<Goal, string> = {
  lose: "Lose weight",
  maintain: "Eat healthier / maintain",
  gain: "Gain weight",
  muscle: "Build muscle",
};

export const dietLabels: Record<Diet, string> = {
  everything: "I eat everything",
  "no-pork": "No pork",
  pescatarian: "Fish but no meat",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
};

export const healthLabels: Record<HealthFlag, string> = {
  pregnant: "Pregnant",
  breastfeeding: "Breastfeeding",
  diabetes: "Diabetes or pre-diabetes",
  hypertension: "High blood pressure",
  kidney: "Kidney condition",
  liver: "Liver condition",
  heart: "Heart condition",
  "eating-disorder": "History of an eating disorder",
  other: "Another medical condition",
};

const activityFactor: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
const proteinPerKg: Record<Goal, number> = { lose: 1.2, maintain: 1.0, gain: 1.2, muscle: 1.6 };

export type BmiBand = { label: string; note: string };

export function bmiBand(bmi: number): BmiBand {
  if (bmi < 18.5) return { label: "Underweight", note: "Below the healthy range. Gaining some weight with nutrient-dense food would help." };
  if (bmi < 25) return { label: "Healthy weight", note: "Within the healthy range. Focus on quality, balance and consistency." };
  if (bmi < 30) return { label: "Overweight", note: "Above the healthy range. A modest, steady reduction brings real health benefits." };
  return { label: "Obesity range", note: "Well above the healthy range. Guided support gives the best and safest results." };
}

export type Referral = { refer: true; reasons: string[] };

/** Cases the automatic plan must never handle. These go straight to Mitchell. */
export function needsReferral(input: QuizInput): Referral | null {
  const reasons: string[] = [];
  if (input.age < 18) reasons.push("You are under 18. Growing bodies need a plan made by a nutritionist.");
  if (input.age > 75) reasons.push("Nutrition needs change with age and deserve a personal assessment.");
  if (input.health.length > 0) {
    reasons.push(
      `You told us about: ${input.health.map((h) => healthLabels[h].toLowerCase()).join(", ")}. These need a plan tailored by Mitchell, not an automatic one.`
    );
  }
  const bmi = calcBmi(input.heightCm, input.weightKg);
  if (bmi < 16) reasons.push("Your BMI is very low. Please speak to Mitchell directly for safe guidance.");
  if (bmi >= 40) reasons.push("At this BMI, personal guidance gives the safest and best results.");
  return reasons.length ? { refer: true, reasons } : null;
}

export function calcBmi(heightCm: number, weightKg: number) {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function calcTargets(input: QuizInput) {
  const bmr =
    10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + (input.sex === "male" ? 5 : -161);
  const tdee = bmr * activityFactor[input.activity];
  let target = tdee;
  if (input.goal === "lose") target = tdee - 500;
  if (input.goal === "gain") target = tdee + 300;
  if (input.goal === "muscle") target = tdee + 250;
  // Safety floor: never below a safe minimum, never below BMR for weight loss.
  const floor = Math.max(input.sex === "male" ? 1500 : 1200, input.goal === "lose" ? bmr : 0);
  target = Math.max(target, floor);
  const calories = Math.round(target / 50) * 50;
  const protein = Math.round(input.weightKg * proteinPerKg[input.goal]);
  const water = Math.round((input.weightKg * 0.033) * 10) / 10;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories, protein, water };
}

// ---------------------------------------------------------------------------
// Food list (edit freely). kcal = approximate energy of a standard portion.
// contains: what the meal has, used to filter for diet and allergies.

type Contains = "beef" | "chicken" | "fish" | "egg" | "dairy" | "nuts" | "gluten";

type Meal = {
  name: string;
  detail: string;
  kcal: number;
  contains: Contains[];
  budget: Budget;
};

const breakfasts: Meal[] = [
  { name: "Wimbi porridge & banana", detail: "Millet uji (no sugar, or 1 tsp honey), 1 banana, a few roasted groundnuts", kcal: 380, contains: ["nuts"], budget: "low" },
  { name: "Boiled eggs & avocado toast", detail: "2 boiled eggs, 1 slice brown bread, ¼ avocado, tea with little or no sugar", kcal: 400, contains: ["egg", "gluten"], budget: "low" },
  { name: "Sweet potato & eggs", detail: "1 medium boiled sweet potato, 2 eggs (boiled or lightly fried), sliced tomatoes", kcal: 390, contains: ["egg"], budget: "low" },
  { name: "Nduma & milk tea", detail: "Boiled arrowroot (fist-sized portion), milk tea with little or no sugar, 1 orange", kcal: 360, contains: ["dairy"], budget: "low" },
  { name: "Oats with milk & pawpaw", detail: "½ cup oats cooked in milk, topped with pawpaw and a sprinkle of seeds", kcal: 390, contains: ["dairy", "gluten"], budget: "medium" },
  { name: "Spanish omelette", detail: "2-egg omelette with tomato, onion, dhania and spinach, 1 slice brown bread", kcal: 380, contains: ["egg", "gluten"], budget: "medium" },
  { name: "Yoghurt fruit bowl", detail: "1 cup natural yoghurt, mango or pawpaw, 2 tbsp oats and a few nuts", kcal: 360, contains: ["dairy", "nuts", "gluten"], budget: "medium" },
  { name: "Ndengu & sweet potato", detail: "Leftover green gram stew with ½ sweet potato and black tea", kcal: 370, contains: [], budget: "low" },
  { name: "Peanut butter porridge", detail: "Millet or sorghum uji with 1 tbsp peanut butter and a banana", kcal: 400, contains: ["nuts"], budget: "low" },
];

const lunches: Meal[] = [
  { name: "Ugali, sukuma & beef stew", detail: "Fist-sized brown ugali, a big portion of sukuma wiki, lean beef stew (palm-sized)", kcal: 600, contains: ["beef"], budget: "low" },
  { name: "Githeri & avocado", detail: "1½ cups githeri (maize & beans) cooked with vegetables, ¼ avocado", kcal: 560, contains: [], budget: "low" },
  { name: "Brown rice & ndengu", detail: "1 cup brown rice, ndengu stew, kachumbari on the side", kcal: 580, contains: [], budget: "low" },
  { name: "Chapati & bean stew", detail: "1 wholemeal chapati, bean stew, steamed cabbage and carrots", kcal: 590, contains: ["gluten"], budget: "low" },
  { name: "Ugali, omena & managu", detail: "Brown ugali, omena cooked with tomatoes, managu or terere", kcal: 570, contains: ["fish"], budget: "low" },
  { name: "Grilled chicken & matoke", detail: "Grilled or stewed chicken (no skin), matoke, steamed mixed vegetables", kcal: 600, contains: ["chicken"], budget: "medium" },
  { name: "Tilapia, ugali & sukuma", detail: "Boiled or grilled tilapia, small brown ugali, sukuma wiki", kcal: 590, contains: ["fish"], budget: "medium" },
  { name: "Lentil stew & rice", detail: "Kamande (lentil) stew with 1 cup brown rice and a green salad", kcal: 560, contains: [], budget: "low" },
  { name: "Brown pilau & kachumbari", detail: "1 cup brown-rice pilau with lean beef, kachumbari, steamed greens", kcal: 620, contains: ["beef"], budget: "medium" },
];

const dinners: Meal[] = [
  { name: "Sweet potato, beef & spinach", detail: "Boiled sweet potatoes, lean beef stew, a large portion of spinach", kcal: 520, contains: ["beef"], budget: "low" },
  { name: "Mukimo & chicken stew", detail: "Mukimo (potato, peas, pumpkin leaves, maize), chicken stew without skin", kcal: 540, contains: ["chicken"], budget: "medium" },
  { name: "Rice, beans & cabbage", detail: "¾ cup brown rice, bean stew, fried cabbage with little oil", kcal: 500, contains: [], budget: "low" },
  { name: "Fish, sukuma & small ugali", detail: "Tilapia or dagaa, small brown ugali, sukuma wiki", kcal: 510, contains: ["fish"], budget: "medium" },
  { name: "Lentil soup & chapati", detail: "Thick lentil and vegetable soup with 1 wholemeal chapati", kcal: 480, contains: ["gluten"], budget: "low" },
  { name: "Chicken, rice & vegetables", detail: "Chicken stew, ¾ cup brown rice, steamed carrots, French beans", kcal: 530, contains: ["chicken"], budget: "medium" },
  { name: "Ndengu, ugali & managu", detail: "Ndengu stew, small brown ugali, managu", kcal: 500, contains: [], budget: "low" },
  { name: "Vegetable stir-fry & rice", detail: "Mushrooms, cabbage, carrots and capsicum stir-fry, ¾ cup brown rice", kcal: 470, contains: [], budget: "medium" },
  { name: "Matoke & beef", detail: "Matoke cooked with lean beef, tomatoes and onions, green salad", kcal: 530, contains: ["beef"], budget: "low" },
];

const snacks: Meal[] = [
  { name: "Fruit", detail: "1 orange, a slice of pawpaw or a small mango", kcal: 80, contains: [], budget: "low" },
  { name: "Groundnuts", detail: "A small handful of roasted or boiled groundnuts", kcal: 170, contains: ["nuts"], budget: "low" },
  { name: "Natural yoghurt", detail: "1 small cup of natural (unsweetened) yoghurt", kcal: 120, contains: ["dairy"], budget: "medium" },
  { name: "Boiled egg", detail: "1 boiled egg with a pinch of salt and pepper", kcal: 80, contains: ["egg"], budget: "low" },
  { name: "Carrot & cucumber sticks", detail: "Raw carrot and cucumber sticks", kcal: 50, contains: [], budget: "low" },
  { name: "Banana", detail: "1 medium banana", kcal: 105, contains: [], budget: "low" },
  { name: "Roasted maize", detail: "½ roasted maize cob (no added salt)", kcal: 110, contains: [], budget: "low" },
  { name: "Mursik or maziwa lala", detail: "1 small glass of fermented milk", kcal: 120, contains: ["dairy"], budget: "low" },
];

function excludedFor(diet: Diet, allergies: Allergy[]): Set<Contains> {
  const out = new Set<Contains>(allergies as Contains[]);
  if (diet === "pescatarian") ["beef", "chicken"].forEach((c) => out.add(c as Contains));
  if (diet === "vegetarian") ["beef", "chicken", "fish"].forEach((c) => out.add(c as Contains));
  if (diet === "vegan") ["beef", "chicken", "fish", "egg", "dairy"].forEach((c) => out.add(c as Contains));
  return out;
}

function pick(list: Meal[], excluded: Set<Contains>, budget: Budget): Meal[] {
  const ok = list.filter((m) => !m.contains.some((c) => excluded.has(c)));
  if (budget === "low") {
    const cheap = ok.filter((m) => m.budget === "low");
    if (cheap.length >= 3) return cheap;
  }
  return ok;
}

function portion(target: number, base: number) {
  const r = target / base;
  if (r < 0.85) return "Smaller portion";
  if (r > 1.25) return "Larger portion";
  if (r > 1.1) return "Slightly larger portion";
  return "Standard portion";
}

export type PlannedMeal = { slot: string; name: string; detail: string; kcal: number; portion: string };
export type PlanDay = { day: string; meals: PlannedMeal[] };

export function buildPlan(input: QuizInput, calories: number): PlanDay[] {
  const excluded = excludedFor(input.diet, input.allergies);
  const b = pick(breakfasts, excluded, input.budget);
  const l = pick(lunches, excluded, input.budget);
  const d = pick(dinners, excluded, input.budget);
  const s = pick(snacks, excluded, input.budget);

  const share = { breakfast: 0.25, snack1: 0.1, lunch: 0.32, snack2: 0.08, dinner: 0.25 };
  const days = ["Day 1", "Day 2", "Day 3"];

  return days.map((day, i) => {
    const slot = (label: string, list: Meal[], key: keyof typeof share, offset = 0): PlannedMeal => {
      const m = list[(i * 2 + offset) % list.length];
      const target = Math.round(calories * share[key]);
      return { slot: label, name: m.name, detail: m.detail, kcal: target, portion: portion(target, m.kcal) };
    };
    return {
      day,
      meals: [
        slot("Breakfast", b, "breakfast"),
        slot("Mid-morning", s, "snack1"),
        slot("Lunch", l, "lunch", 1),
        slot("Afternoon", s, "snack2", 3),
        slot("Dinner", d, "dinner", 2),
      ],
    };
  });
}

export const generalTips = [
  "Drink water through the day: a glass when you wake up and one before each meal.",
  "Fill half your plate with vegetables (sukuma, managu, cabbage, spinach, carrots).",
  "Choose brown ugali, brown rice and wholemeal chapati over refined versions.",
  "Limit sugar in tea, sodas and juices. These add up fast.",
  "Use little oil, and prefer boiling, steaming and grilling over deep frying.",
  "Eat your last meal 2–3 hours before bed.",
];
