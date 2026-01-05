import Image from "next/image";
import { CollegeCard } from "@/components/types";
import { formatMoneyUSD, formatNumber, formatPercent } from "@/components/utils";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-1 text-sm">
      <div className="text-white/70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{children}</span>;
}

function ButtonLink({ href, children }: { href?: string | null; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg bg-carolina-400 px-3 py-2 text-xs font-bold text-deepblue-900 hover:bg-carolina-300"
    >
      {children}
    </a>
  );
}

export default function CollegeCardView({ c, showMatch }: { c: CollegeCard; showMatch: boolean }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
      <div className="relative aspect-[16/9] w-full bg-white/10">
        {c.imageUrl ? (
          <Image
            src={c.imageUrl}
            alt={`${c.name} campus`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/60">
            No image found
          </div>
        )}
        {showMatch && typeof c.matchScore === "number" ? (
          <div className="absolute left-3 top-3 rounded-full bg-accentorange-400 px-3 py-1 text-xs font-extrabold text-deepblue-900">
            Match {Math.round(c.matchScore)}%
          </div>
        ) : null}
      </div>

      <div className="flex min-h-[92px] flex-col gap-1 px-5 pt-4">
        <div className="min-h-[48px] text-lg font-extrabold leading-tight">{c.name}</div>
        <div className="text-sm text-white/75">
          {(c.city || c.state) ? `${c.city ?? ""}${c.city && c.state ? ", " : ""}${c.state ?? ""}` : "—"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {c.hasD1Sports !== null && c.hasD1Sports !== undefined ? <Pill>D1 Sports: {c.hasD1Sports ? "Yes" : "No"}</Pill> : null}
          {c.hasGreekLife !== null && c.hasGreekLife !== undefined ? <Pill>Greek Life: {c.hasGreekLife ? "Yes" : "No"}</Pill> : null}
        </div>
      </div>

      <div className="mt-4 px-5 pb-4">
        <Row label="Undergrad size" value={formatNumber(c.undergradSize ?? null)} />
        <Row label="Acceptance rate" value={formatPercent(c.acceptanceRate ?? null)} />
        <Row label="Avg SAT" value={formatNumber(c.satAvg ?? null)} />
        <Row label="Avg ACT" value={formatNumber(c.actMid ?? null)} />
        <Row label="Avg GPA" value={formatNumber(c.avgGpa ?? null)} />
        <Row label="Tuition (in-state)" value={formatMoneyUSD(c.tuitionIn ?? null)} />
        <Row label="Tuition (out-of-state)" value={formatMoneyUSD(c.tuitionOut ?? null)} />

        {c.notableAlumni && c.notableAlumni.length ? (
          <div className="mt-3">
            <div className="text-sm font-semibold text-white/80">Most notable alumni</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/90">
              {c.notableAlumni.slice(0, 4).map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        ) : null}

        {c.funFact ? (
          <div className="mt-3">
            <div className="text-sm font-semibold text-white/80">Fun fact</div>
            <div className="mt-2 text-sm text-white/90">{c.funFact}</div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href={c.admissionsUrl}>Application Info</ButtonLink>
          <ButtonLink href={c.website}>School website</ButtonLink>
          <ButtonLink href={c.financialAidUrl}>Financial aid</ButtonLink>
          <ButtonLink href={c.instagramUrl}>Instagram</ButtonLink>
        </div>
      </div>
    </div>
  );
}
