# College Match (MVP)

A Next.js (App Router) website with:
- Find Colleges page (Expedia-style search + up to 10 matches)
- Compare Schools page (2–3 school typeahead + side-by-side cards)
- Working school images (Wikipedia thumbnail → Clearbit logo fallback)
- Up-to-date core stats via the U.S. Dept. of Education College Scorecard API
- ChatGPT-powered chatbox via OpenAI API

## 1) Setup

1. Install Node 18+.
2. In this folder, install deps:
   ```bash
   npm install
   ```
3. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in:
   - `COLLEGESCORECARD_API_KEY`
   - `OPENAI_API_KEY`

College Scorecard API docs & base URL: https://api.data.gov/ed/collegescorecard/v1/schools citeturn3view0

## 2) Run locally

```bash
npm run dev
```

Open http://localhost:3000

## 3) Deploy (easy path)
Deploy to Vercel:
- Add the same env vars in Vercel project settings
- Build command: `npm run build`

## Notes / Next Improvements
- Add true admissions/application/financial aid/instagram links via a curated mapping (schools vary a lot).
- Replace AI-derived alumni/fun facts with a structured data source or a vetted dataset.
- Add caching (Redis) for enrichment/image lookups at scale.

## 4) Publish (get a real URL)

### Option A: Vercel (recommended)
1. Create a GitHub repo and push this project.
2. In Vercel, click **Add New → Project**, import the repo.
3. Add Environment Variables in Vercel:
   - `COLLEGESCORECARD_API_KEY`
   - `OPENAI_API_KEY`
4. Deploy. Vercel will give you a live URL like `https://your-project.vercel.app`.

Vercel Next.js guide: https://vercel.com/docs/frameworks/full-stack/nextjs citeturn0search11  
Vercel environment variables: https://vercel.com/docs/environment-variables citeturn0search22  
Next.js env var behavior: https://nextjs.org/docs/app/guides/environment-variables citeturn0search15

### Option B: Custom domain
In Vercel → Project → Settings → Domains → add your domain and follow DNS instructions.
