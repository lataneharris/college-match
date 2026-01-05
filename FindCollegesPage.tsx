"use client";

import { useMemo, useState } from "react";
import CollegeCardView from "@/components/CollegeCardView";
import { CollegeCard, FindInputs, RegionPref, SizePref, YesNoPref } from "@/components/types";

const DEFAULTS: FindInputs = {
  sat: 1400,
  act: 30,
  gpa: 3.8,
  size: "no_preference",
  region: "no_preference",
  state: "",
  d1Sports: "no_preference",
  greekLife: "no_preference",
  control: "no_preference",
};

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-carolina-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="text-black">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-carolina-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default function FindCollegesPage() {
  const [inputs, setInputs] = useState<FindInputs>(DEFAULTS);
  const [results, setResults] = useState<CollegeCard[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSearch = useMemo(() => {
    return Boolean(inputs.sat || inputs.act || inputs.gpa || inputs.state || inputs.region !== "no_preference");
  }, [inputs]);

  async function search() {
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      setResults(data.results ?? []);
      setNote(data.note ?? null);
    } catch (e: any) {
      setNote(e?.message ?? "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInputs(DEFAULTS);
    setResults([]);
    setNote(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-carolina-50/10 p-5 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-extrabold">Find Your College Match</div>
            <div className="text-sm text-white/75">
              Enter a few details and we’ll return up to 10 schools that fit your preferences.
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={search}
              disabled={!canSearch || loading}
              className="rounded-xl bg-accentorange-400 px-4 py-2 text-sm font-extrabold text-deepblue-900 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Find matches"}
            </button>
            <button
              onClick={reset}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Reset search
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">SAT (0–1600)</div>
            <Input
              value={inputs.sat?.toString() ?? ""}
              onChange={(v) => setInputs((p) => ({ ...p, sat: v ? Number(v) : undefined }))}
              placeholder="e.g., 1400"
            />
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">ACT</div>
            <Input
              value={inputs.act?.toString() ?? ""}
              onChange={(v) => setInputs((p) => ({ ...p, act: v ? Number(v) : undefined }))}
              placeholder="e.g., 30"
            />
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">GPA</div>
            <Input
              value={inputs.gpa?.toString() ?? ""}
              onChange={(v) => setInputs((p) => ({ ...p, gpa: v ? Number(v) : undefined }))}
              placeholder="e.g., 3.8"
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">School size</div>
            <Select
              value={inputs.size}
              onChange={(v) => setInputs((p) => ({ ...p, size: v as SizePref }))}
              options={[
                { value: "no_preference", label: "No Preference" },
                { value: "small", label: "Small (<5,000)" },
                { value: "medium", label: "Medium (5,000–15,000)" },
                { value: "large", label: "Large (>15,000)" },
              ]}
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">Region</div>
            <Select
              value={inputs.region}
              onChange={(v) => setInputs((p) => ({ ...p, region: v as RegionPref }))}
              options={[
                { value: "no_preference", label: "No Preference" },
                { value: "Southeast", label: "Southeast" },
                { value: "Northeast", label: "Northeast" },
                { value: "Midwest", label: "Midwest" },
                { value: "Southwest", label: "Southwest" },
                { value: "West", label: "West" },
              ]}
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">State (optional)</div>
            <Input
              value={inputs.state ?? ""}
              onChange={(v) => setInputs((p) => ({ ...p, state: v }))}
              placeholder="e.g., VA or Virginia"
            />
            <div className="mt-1 text-xs text-white/60">
              If provided, only schools in that state will be shown.
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">Division 1 sports</div>
            <Select
              value={inputs.d1Sports}
              onChange={(v) => setInputs((p) => ({ ...p, d1Sports: v as YesNoPref }))}
              options={[
                { value: "no_preference", label: "No Preference" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">Greek life</div>
            <Select
              value={inputs.greekLife}
              onChange={(v) => setInputs((p) => ({ ...p, greekLife: v as YesNoPref }))}
              options={[
                { value: "no_preference", label: "No Preference" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-white/70">Public / Private</div>
            <Select
              value={inputs.control}
              onChange={(v) => setInputs((p) => ({ ...p, control: v as any }))}
              options={[
                { value: "no_preference", label: "No Preference" },
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
            />
          </div>
        </div>
      </section>

      {note ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">{note}</div>
      ) : null}

      <section className="space-y-3">
        <div className="text-lg font-extrabold">Your College Matches</div>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Run a search to see results here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((c) => (
              <CollegeCardView key={c.id} c={c} showMatch />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-lg font-extrabold">Ask our college chatbox</div>
        <div className="mb-3 text-sm text-white/75">
          Please use our chatbox to answer any college related questions you have.
        </div>
        <Chatbox />
      </section>
    </div>
  );
}

function Chatbox() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setText("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: trimmed }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Chat failed");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${e?.message ?? "unknown"}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-deepblue-900/40 p-4">
      <div className="max-h-64 space-y-3 overflow-auto pr-1">
        {messages.length === 0 ? (
          <div className="text-sm text-white/60">Try: “What’s the difference between early action and early decision?”</div>
        ) : null}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={[
                "inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                m.role === "user" ? "bg-carolina-400 text-deepblue-900" : "bg-white/10 text-white",
              ].join(" ")}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-carolina-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-xl bg-accentorange-400 px-4 py-2 text-sm font-extrabold text-deepblue-900 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
