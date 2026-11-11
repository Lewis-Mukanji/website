# Nourished by Mitchell: website (Phase 1)

## Run it on your computer

```bash
cd website
npm install      # first time only
npm run dev
```

Open http://localhost:3000. Mitchell's dashboard is at http://localhost:3000/admin.

## Where to edit things

| What | File |
| --- | --- |
| Phone, Instagram, email, M-Pesa, KNDI number | `src/lib/site.ts` (top of file) |
| Services, descriptions and **prices** | `src/lib/site.ts` (`serviceGroups`) |
| Meal plan foods, portions, calorie rules | `src/lib/mealplan.ts` |
| Mitchell's bio | `src/app/about/page.tsx` (replace the [bracketed] parts) |
| FAQ answers | `src/app/faq/page.tsx` |
| Tips & recipes | `src/app/tips/page.tsx` |
| Logo / portrait | `public/images/` |
| Dashboard password | `.env.local` (`ADMIN_PASSWORD`) |

## Pages

Home, About, Services, Free Meal Plan (quiz, results and PDF), Tips & Recipes, FAQ, Contact (enquiry form),
Privacy, and `/admin` (leads dashboard).

## Leads

Quiz submissions and enquiries are saved to `data/leads.json` (kept out of git; it holds personal data).
Before going live on Vercel this moves to a hosted database (Supabase), because Vercel can't save files.

## Before launch

- Fill in prices, bio details, KNDI number and business email in the files above.
- Replace the placeholder testimonials on the home page with real ones (with permission).
- Move leads to Supabase, add email/WhatsApp alerts for new leads, buy the domain, deploy to Vercel.
