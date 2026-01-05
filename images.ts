export async function getBestImageForSchool(name: string, schoolUrl?: string | null): Promise<string | null> {
  // 1) Try Wikipedia summary thumbnail (campus-ish images often available)
  const wiki = await wikiThumb(name);
  if (wiki) return wiki;

  // 2) Fallback: Clearbit logo based on domain (not campus photo, but better than grey box)
  const domain = normalizeDomain(schoolUrl ?? "");
  if (domain) return `https://logo.clearbit.com/${domain}`;

  return null;
}

function normalizeDomain(url: string): string | null {
  try {
    if (!url) return null;
    const u = url.startsWith("http") ? new URL(url) : new URL(`https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function wikiThumb(title: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;
    const data: any = await res.json();
    const thumb = data?.thumbnail?.source as string | undefined;
    if (thumb) return thumb;

    // sometimes the page title is different; try removing common suffixes
    const simplified = title.replace(/\s*\(.*\)\s*$/, "");
    if (simplified !== title) return await wikiThumb(simplified);
    return null;
  } catch {
    return null;
  }
}
