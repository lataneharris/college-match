import { NextResponse } from "next/server";
import { fetchSchools, buildUrl, requireEnv } from "../_lib/scorecard";

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryRaw = (url.searchParams.get("query") ?? "").trim();
    if (queryRaw.length < 2) return NextResponse.json({ results: [] });

    const q = normalize(queryRaw);

    // 1) Try API filtered by school.name (often works for partial tokens).
    let results = await fetchSchools({ "school.name": queryRaw, "per_page": 100 });

    // 2) If that didn't return enough, do a small broad scan sorted by size (5 pages max)
    // and filter locally for prefix/substring matches.
    if ((results?.length ?? 0) < 8) {
      // Manual fetch because fetchSchools always sets per_page=100 but not page/sort
      const apiKey = requireEnv("COLLEGESCORECARD_API_KEY");
      const fields = ["id","school.name","school.city","school.state"].join(",");
      const out: any[] = [];
      for (let page = 0; page < 5; page++) {
        const u = new URL("https://api.data.gov/ed/collegescorecard/v1/schools");
        u.searchParams.set("api_key", apiKey);
        u.searchParams.set("fields", fields);
        u.searchParams.set("per_page", "100");
        u.searchParams.set("page", String(page));
        u.searchParams.set("sort", "latest.student.size:desc");
        const res = await fetch(u.toString(), { next: { revalidate: 60 * 60 } });
        if (!res.ok) break;
        const data = await res.json();
        const rows = (data?.results ?? []) as any[];
        for (const s of rows) {
          const name = s["school.name"] as string;
          if (!name) continue;
          const nn = normalize(name);
          if (nn.includes(q)) out.push(s);
        }
        if (out.length >= 25) break;
      }
      results = [...results, ...out];
    }

    // De-dupe by id and return top matches (prefer prefix)
    const seen = new Set<number>();
    const scored = results
      .map((s: any) => {
        const name = s["school.name"] as string;
        const nn = normalize(name);
        const prefix = nn.startsWith(q) ? 2 : 0;
        const word = nn.split(" ").some((w: string) => w.startsWith(q)) ? 1 : 0;
        const contains = nn.includes(q) ? 0.5 : 0;
        return { s, score: prefix + word + contains };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ s }) => s)
      .filter((s: any) => {
        const id = s["id"];
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 20)
      .map((s: any) => ({
        id: s["id"],
        name: s["school.name"],
        city: s["school.city"],
        state: s["school.state"],
      }));

    return NextResponse.json({ results: scored });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 400 });
  }
}
