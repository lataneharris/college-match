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
