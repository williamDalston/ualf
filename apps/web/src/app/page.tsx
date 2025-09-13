"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Analytics = {
  effect_size: number;
  time_to_mastery_days: number;
  violation_rate: number;
  cogs_per_user_month: number;
  p95_latency_ms: number;
};

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://127.0.0.1:8000") as string;

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 sm:p-5 shadow-sm bg-white/70 dark:bg-black/30 backdrop-blur">
      <div className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-black/60 dark:text-white/60">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "zinc" | "blue";
}) {
  const color =
    tone === "green"
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
      : tone === "red"
      ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
      : tone === "blue"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${color}`}>
      {children}
    </span>
  );
}

export default function Home() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setErr(null);
    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;

    try {
      const t0 = performance.now();
      const res = await fetch(`${API_URL}/analytics/summary`, {
        signal: ctl.signal,
      });
      const t1 = performance.now();
      setPingMs(Math.round(t1 - t0));

      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }
      const data: Analytics = await res.json();
      setAnalytics(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const id = setInterval(fetchAnalytics, 20_000);
    return () => clearInterval(id);
  }, [fetchAnalytics]);

  const apiHealth = useMemo<"up" | "down" | "unknown">(() => {
    if (loading && !analytics) return "unknown";
    return analytics ? "up" : "down";
  }, [loading, analytics]);

  return (
    <div className="font-sans min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-black text-zinc-900 dark:text-zinc-100">
      <header className="px-6 sm:px-10 py-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="UALF"
            width={36}
            height={36}
            priority
          />
          <div>
            <div className="text-lg font-semibold leading-tight">
              Universal AI Learning Factory
            </div>
            <div className="text-xs text-black/60 dark:text-white/60">
              Manufacture competence, not courses.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {apiHealth === "up" && <Badge tone="green">API online {pingMs ? `(${pingMs}ms)` : ""}</Badge>}
          {apiHealth === "down" && <Badge tone="red">API offline</Badge>}
          {apiHealth === "unknown" && <Badge>Checking API…</Badge>}
          <button
            onClick={fetchAnalytics}
            className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="row-start-2 px-6 sm:px-10 py-8 max-w-6xl w-full mx-auto">
        <section className="flex flex-col lg:flex-row items-start gap-8 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your learning factory control room
            </h1>
            <p className="mt-2 text-sm sm:text-base text-black/70 dark:text-white/70 max-w-[60ch]">
              This dashboard pulls real metrics from your FastAPI backend (
              <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
                {API_URL}
              </code>
              ) and gives you quick actions to build a Mastery Module or test the Socratic Tutor.
            </p>
            {err ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {err}
              </p>
            ) : null}
          </div>
          <div className="flex gap-3">
            <a
              href="/studio/new"
              className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-medium shadow hover:opacity-90 transition"
            >
              + New Mastery Module
            </a>
            <a
              href="/tutor"
              className="rounded-2xl border border-black/10 dark:border-white/15 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Open Socratic Tutor
            </a>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Effect Size"
            value={
              analytics ? analytics.effect_size.toFixed(2) : loading ? "…" : "—"
            }
            hint="vs. control on higher-order tasks"
          />
          <StatCard
            label="Time to Mastery"
            value={
              analytics
                ? `${analytics.time_to_mastery_days} d`
                : loading
                ? "…"
                : "—"
            }
            hint="median learner"
          />
          <StatCard
            label="Policy Violation Rate"
            value={
              analytics
                ? `${(analytics.violation_rate * 100).toFixed(1)}%`
                : loading
                ? "…"
                : "—"
            }
            hint="content + dialog safety"
          />
          <StatCard
            label="COGS/User"
            value={
              analytics
                ? `$${analytics.cogs_per_user_month.toFixed(2)}`
                : loading
                ? "…"
                : "—"
            }
            hint="LLM + infra est."
          />
          <StatCard
            label="Tutor p95 Latency"
            value={
              analytics ? `${analytics.p95_latency_ms} ms` : loading ? "…" : "—"
            }
            hint="conversation turns"
          />
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-black/30">
            <h2 className="text-lg font-semibold">Quick start</h2>
            <ol className="mt-3 list-decimal list-inside text-sm space-y-1 text-black/80 dark:text-white/80">
              <li>Create a Mastery Module in the Studio.</li>
              <li>Add objectives mapped to Bloom levels.</li>
              <li>Generate formative checks and remedials.</li>
              <li>Test in the Socratic Tutor.</li>
              <li>Invite a pilot learner group.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-black/30">
            <h2 className="text-lg font-semibold">API tools</h2>
            <div className="mt-3 text-sm">
              <div className="flex items-center justify-between py-1.5">
                <span>/analytics/summary</span>
                <a
                  className="underline underline-offset-4 hover:opacity-80"
                  href={`${API_URL}/analytics/summary`}
                  target="_blank"
                >
                  Open
                </a>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>/tutor/turn</span>
                <a
                  className="underline underline-offset-4 hover:opacity-80"
                  href={`${API_URL}/tutor/turn`}
                  target="_blank"
                >
                  Stream
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-black/30">
            <h2 className="text-lg font-semibold">Brand & links</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <a
                className="rounded-full border px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
              <a
                className="rounded-full border px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
                href="https://vercel.com/templates?framework=next.js"
                target="_blank"
                rel="noreferrer"
              >
                Templates
              </a>
              <a
                className="rounded-full border px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noreferrer"
              >
                Learn
              </a>
            </div>
            <div className="mt-4 text-xs text-black/60 dark:text-white/60">
              Update your env in <code>.env.local</code>:
              <pre className="mt-1 p-2 rounded bg-black/5 dark:bg-white/10 overflow-auto">
{`NEXT_PUBLIC_API_URL=${API_URL}`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="row-start-3 px-6 sm:px-10 py-6 border-t border-black/10 dark:border-white/10 text-xs flex items-center justify-between">
        <span>© {new Date().getFullYear()} UALF</span>
        <span className="flex items-center gap-2">
          <Image aria-hidden src="/globe.svg" alt="" width={16} height={16} />
          Build for outcomes, not hours watched.
        </span>
      </footer>
    </div>
  );
}
