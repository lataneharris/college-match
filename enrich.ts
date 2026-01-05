import OpenAI from "openai";
import { requireEnv } from "./scorecard";

export type Enrichment = { notableAlumni: string[] | null; funFact: string | null; hasGreekLife: boolean | null; hasD1Sports: boolean | null };

const cache = new Map<number, Enrichment>();

export async function enrichSchool(id: number, name: string, state?: string) : Promise<Enrichment> {
  if (cache.has(id)) return cache.get(id)!;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const empty = { notableAlumni: null, funFact: null, hasGreekLife: null, hasD1Sports: null };
    cache.set(id, empty);
    return empty;
  }

  const client = new OpenAI({ apiKey });

  const prompt = `You are helping build a college comparison site.
Given the school name and state, return:
- hasGreekLife (true/false/null if unsure)
- hasD1Sports (true/false/null if unsure)
- notableAlumni: up to 4 names (omit if unsure)
- funFact: one short fun fact (omit if unsure)
Return strict JSON with keys: hasGreekLife, hasD1Sports, notableAlumni, funFact.
School: ${name}${state ? `, ${state}` : ""}`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const text = resp.choices?.[0]?.message?.content ?? "";
  let parsed: any = null;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    parsed = null;
  }

  const out: Enrichment = {
    hasGreekLife: typeof parsed?.hasGreekLife === "boolean" ? parsed.hasGreekLife : null,
    hasD1Sports: typeof parsed?.hasD1Sports === "boolean" ? parsed.hasD1Sports : null,
    notableAlumni: Array.isArray(parsed?.notableAlumni) && parsed.notableAlumni.length ? parsed.notableAlumni.slice(0,4) : null,
    funFact: typeof parsed?.funFact === "string" && parsed.funFact.trim() ? parsed.funFact.trim() : null,
  };

  cache.set(id, out);
  return out;
}

function extractJson(s: string): string {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON");
  return s.slice(start, end + 1);
}
