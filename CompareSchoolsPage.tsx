"use client";

import { useEffect, useMemo, useState } from "react";
import CollegeCardView from "@/components/CollegeCardView";
import { CollegeCard } from "@/components/types";

type Suggestion = { id: number; name: string; state?: string; city?: string };

export default function CompareSchoolsPage() {
  const [slots, setSlots] = useState<(Suggestion | null)[]>([null, null, null]);
  const [results, setResults] = useState<CollegeCard[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ids = useMemo(() => slots.filter(Boolean).map((s) => (s as Suggestion).id), [slots]);

  useEffect(() => {
    setResults([]);
    setNote(null);
  }, [ids.join(",")]);

  async function compare() {
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      setResults(data.results ?? []);
    } catch (e: any) {
      setNote(e?.message ?? "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-carolina-50/10 p-5 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-extrabold">Compare Schools</div>
            <div className="text-sm text-white/75">
              Select up to 3 colleges and compare them side-by-side.
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={compare}
              disabled={ids.length < 2 || loading}
              className="rounded-xl bg-accentorange-400 px-4 py-2 text-sm font-extrabold text-deepblue-900 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Compare"}
            </button>
            <button
              onClick={() => setSlots([null, null, null])}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {slots.map((s, idx) => (
            <Typeahead
              key={idx}
              label={`College ${idx + 1}`}
              value={s}
              onChange={(val) => setSlots((prev) => prev.map((p, i) => (i === idx ? val : p)))}
              excludeIds={new Set(ids)}
            />
          ))}
        </div>
      </section>

      {note ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">{note}</div>
      ) : null}

      <section className="space-y-3">
        <div className="text-lg font-extrabold">Comparison</div>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Select at least 2 schools and click Compare.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((c) => (
              <CollegeCardView key={c.id} c={c} showMatch={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Typeahead({
  label,
  value,
  onChange,
  excludeIds,
}: {
  label: string;
  value: Suggestion | null;
  onChange: (s: Suggestion | null) => void;
  excludeIds: Set<number>;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) setQ(value.name);
  }, [value]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      const query = q.trim();
      if (query.length < 2) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/suggest?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Suggest failed");
        if (ignore) return;
        setItems((data.results ?? []).filter((s: Suggestion) => !excludeIds.has(s.id)));
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [q, excludeIds]);

  return (
    <div className="relative">
      <div className="mb-1 text-xs font-semibold text-white/70">{label}</div>
      <input
        className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-carolina-400"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          onChange(null);
        }}
        placeholder="Start typing (e.g., Texa...)"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (loading || items.length > 0) ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-deepblue-900 shadow-2xl">
          {loading ? (
            <div className="px-3 py-2 text-sm text-white/70">Searching...</div>
          ) : null}
          {items.slice(0, 8).map((s) => (
            <button
              type="button"
              key={s.id}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-white/10"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(s);
                setQ(s.name);
                setOpen(false);
              }}
            >
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-white/60">
                {s.city ? `${s.city}, ` : ""}{s.state ?? ""}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
