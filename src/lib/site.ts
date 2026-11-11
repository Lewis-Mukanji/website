// Central place for brand details, contact info and services.
// Edit here and the whole site updates.

export const site = {
  name: "Nourished by Mitchell",
  shortName: "Nourished",
  tagline: "Food as medicine. Nutrition made personal.",
  city: "Nairobi, Kenya",
  phoneDisplay: "0757 924 704",
  phoneIntl: "254757924704",
  mpesa: "0757 924 704",
  email: "", // add once the business email is created, e.g. hello@nourishedbymitchell.co.ke
  instagram: "_nourishedbymitchell_",
  instagramUrl: "https://www.instagram.com/_nourishedbymitchell_/",
  kndiNumber: "", // add her KNDI registration number
};

export function whatsappLink(message = "Hi Mitchell, I found you on your website and I'd like to know more about your nutrition services.") {
  return `https://wa.me/${site.phoneIntl}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/meal-plan", label: "Free Meal Plan" },
  { href: "/tips", label: "Tips & Recipes" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export type Service = {
  name: string;
  format: string;
  price: string; // fill in once decided, e.g. "KES 3,500"
  blurb: string;
};

export type ServiceGroup = {
  numeral: string;
  slug: string;
  title: string;
  line: string;
  services: Service[];
};

const TBD = "Price on request";

export const serviceGroups: ServiceGroup[] = [
  {
    numeral: "I",
    slug: "consultations",
    title: "Consultations",
    line: "Where it begins. A full look at your body, your habits and what you want to change.",
    services: [
      { name: "Discovery Call", format: "Online · 15 min", price: "Free", blurb: "A short chat to understand your goals and see how Mitchell can help." },
      { name: "Initial Consultation & Assessment", format: "Online or in person", price: TBD, blurb: "Health history, body measurements, eating patterns and a clear plan of action." },
      { name: "Follow-up Session", format: "Online or in person", price: TBD, blurb: "Review progress, adjust your plan and keep momentum." },
    ],
  },
  {
    numeral: "II",
    slug: "meal-plans",
    title: "Meal Plans",
    line: "Written for your body, your budget and the food you actually enjoy.",
    services: [
      { name: "Personalised Meal Plan", format: "1 week · 2 weeks · 1 month", price: TBD, blurb: "Meals, portions and timing built around you." },
      { name: "Weight Loss Plan", format: "Online", price: TBD, blurb: "Sustainable fat loss without starving or giving up Kenyan staples." },
      { name: "Weight Gain & Muscle Plan", format: "Online", price: TBD, blurb: "Healthy weight gain and muscle building with the right protein and energy." },
      { name: "Family Meal Plan", format: "Online", price: TBD, blurb: "One kitchen, one plan that works for the whole household." },
    ],
  },
  {
    numeral: "III",
    slug: "clinical",
    title: "Clinical Nutrition",
    line: "Nutrition care for conditions where food makes the biggest difference.",
    services: [
      { name: "Diabetes & Blood Sugar", format: "Online or in person", price: TBD, blurb: "Steady blood sugar through meal timing, portions and smart swaps." },
      { name: "High Blood Pressure & Heart Health", format: "Online or in person", price: TBD, blurb: "Lower salt, better fats, and a heart-friendly way of eating." },
      { name: "PCOS & Hormonal Balance", format: "Online or in person", price: TBD, blurb: "Eating to support hormones, energy and cycle health." },
      { name: "Gut Health", format: "Online or in person", price: TBD, blurb: "Ulcers, IBS, bloating and digestion support." },
      { name: "Cholesterol Management", format: "Online or in person", price: TBD, blurb: "Practical changes that move your numbers." },
      { name: "Kidney & Liver Support", format: "On medical referral", price: TBD, blurb: "Specialised plans in partnership with your doctor." },
    ],
  },
  {
    numeral: "IV",
    slug: "life-stages",
    title: "Life Stages",
    line: "The right nourishment for every season of life.",
    services: [
      { name: "Pregnancy & Breastfeeding", format: "Online or in person", price: TBD, blurb: "Nourishing you and your baby, safely." },
      { name: "Baby Weaning & Child Nutrition", format: "Online or in person", price: TBD, blurb: "First foods, picky eaters and healthy growth." },
      { name: "Teen Nutrition", format: "Online", price: TBD, blurb: "Energy for school, sport and growing bodies." },
      { name: "Elderly Nutrition", format: "Online or in person", price: TBD, blurb: "Strength, appetite and healthy ageing." },
    ],
  },
  {
    numeral: "V",
    slug: "special-goals",
    title: "Special Goals",
    line: "For the athlete, the plant-based eater and the allergy-aware.",
    services: [
      { name: "Sports & Fitness Nutrition", format: "Online", price: TBD, blurb: "Fuel for training, performance and recovery." },
      { name: "Vegetarian & Vegan Plans", format: "Online", price: TBD, blurb: "Complete plant-based nutrition with nothing missing." },
      { name: "Food Allergy & Intolerance", format: "Online", price: TBD, blurb: "Eat freely while avoiding your triggers." },
    ],
  },
  {
    numeral: "VI",
    slug: "coaching",
    title: "Coaching Programmes",
    line: "Accountability that turns a plan into a lifestyle.",
    services: [
      { name: "4-Week Reset", format: "Online", price: TBD, blurb: "A focused month to reset habits and feel the difference." },
      { name: "8-Week Transformation", format: "Online", price: TBD, blurb: "Plan, weekly check-ins and adjustments for lasting change." },
      { name: "3-Month Lifestyle Coaching", format: "Online + WhatsApp support", price: TBD, blurb: "Weekly sessions and day-to-day support on WhatsApp." },
    ],
  },
  {
    numeral: "VII",
    slug: "corporate",
    title: "Corporate & Group",
    line: "Healthier teams, schools, gyms and communities.",
    services: [
      { name: "Corporate Wellness Talks & Workshops", format: "In person or online", price: "Quote", blurb: "Engaging sessions on energy, stress, eating at work and more." },
      { name: "Staff Health Screening Day", format: "In person", price: "Quote", blurb: "BMI checks and one-on-one nutrition advice for your team." },
      { name: "Monthly Corporate Wellness", format: "In person or online", price: "Quote", blurb: "An ongoing programme for your organisation." },
      { name: "School, Gym & Church Sessions", format: "In person", price: "Quote", blurb: "Talks and programmes for your community." },
      { name: "Group Programme", format: "Online", price: TBD, blurb: "e.g. a 30-day group challenge with shared support." },
    ],
  },
  {
    numeral: "VIII",
    slug: "extras",
    title: "Extras",
    line: "Small things that make healthy eating easier every day.",
    services: [
      { name: "Grocery Guide & Pantry Makeover", format: "Online or in person", price: TBD, blurb: "What to buy, what to swap, how to stock a healthy kitchen." },
      { name: "Cooking Demos & Recipe Guides", format: "Online or in person", price: TBD, blurb: "Simple, healthy Kenyan cooking." },
      { name: "Downloadable Guides", format: "Download", price: TBD, blurb: "e.g. the 7-Day Healthy Breakfast Guide." },
    ],
  },
];

export const allServiceNames = serviceGroups.flatMap((g) => g.services.map((s) => s.name));
