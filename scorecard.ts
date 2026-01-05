import { REGION_TO_STATES, normalizeState } from "./regions";

const BASE = "https://api.data.gov/ed/collegescorecard/v1/schools";

export type ScorecardSchool = Record<string, any>;

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function buildFields() {
  // Using documented field paths (dotted keys) from College Scorecard API docs
  // See: https://collegescorecard.ed.gov/data/api/ citeturn3view0
  return [
    "id",
    "school.name",
    "school.city",
    "school.state",
    "school.school_url",
    "latest.student.size",
    "latest.admissions.admission_rate.overall",
    "latest.admissions.sat_scores.average.overall",
    "latest.admissions.act_scores.midpoint.cumulative",
    "latest.cost.tuition.in_state",
    "latest.cost.tuition.out_of_state",
  ].join(",");
}

export function buildUrl(params: Record<string, string | number | undefined>) {
  const apiKey = requireEnv("COLLEGESCORECARD_API_KEY");
  const u = new URL(BASE);
  u.searchParams.set("api_key", apiKey);
  u.searchParams.set("fields", buildFields());
  u.searchParams.set("per_page", "100");
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === "") return;
    u.searchParams.set(k, String(v));
  });
  return u.toString();
}

export async function fetchSchools(params: Record<string, string | number | undefined>) {
  const url = buildUrl(params);
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Scorecard API error: ${res.status}`);
  const data = await res.json();
  return (data?.results ?? []) as ScorecardSchool[];
}

export function statesForRegion(region: string): string[] | null {
  return REGION_TO_STATES[region] ?? null;
}

export function hardFiltersToParams(opts: {
  region?: string;
  state?: string;
  control?: "public" | "private" | "no_preference";
}) {
  // Scorecard has school.state filter documented. citeturn3view0
  const params: Record<string, string> = {};
  const normState = normalizeState(opts.state);
  if (normState) {
    params["school.state"] = normState;
    return params;
  }
  if (opts.region && opts.region !== "no_preference") {
    const states = statesForRegion(opts.region);
    if (states?.length) {
      // Value list is supported by API docs (comma-separated). citeturn3view0
      params["school.state"] = states.join(",");
    }
  }
  if (opts.control && opts.control !== "no_preference") {
    // Scorecard uses school.ownership: 1=public, 2=private nonprofit, 3=private for-profit (common in Scorecard)
    // We'll filter public vs private (nonprofit + for-profit) at scoring stage unless you want strict control.
    // If you want strict, uncomment below after verifying desired semantics.
    // params["school.ownership"] = opts.control === "public" ? "1" : "2,3";
  }
  return params;
}
