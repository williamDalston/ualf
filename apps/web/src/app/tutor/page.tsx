"use client";
import { useState } from "react";
import { streamTutorTurn } from "@/lib/api";

export default function TutorPage() {
  const [q, setQ] = useState("Explain overfitting like I’m 12.");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setOut(""); setBusy(true);
    try {
      await streamTutorTurn(q, (t) => setOut((s) => s + t));
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">
      <h1 className="text-3xl font-bold">Socratic Tutor</h1>
      <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={q} onChange={(e)=>setQ(e.target.value)} />
      <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-50" onClick={run} disabled={busy}>
        {busy ? "Thinking..." : "Ask"}
      </button>
      <pre className="whitespace-pre-wrap border rounded p-3 min-h-[120px]">{out || "—"}</pre>
    </div>
  );
}
