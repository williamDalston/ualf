export async function apiLive(base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") {
  const r = await fetch(`${base}/analytics/summary`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Live check failed: ${r.status}`);
  return r.json();
}
export async function apiReady(base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") {
  const r = await fetch(`${base}/analytics/summary`, { cache: "no-store" });
  return r.ok;
}
