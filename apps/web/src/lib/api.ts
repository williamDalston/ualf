export const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const modules = {
  list: () => fetch(`${API}/modules`).then(j),
  create: (body: { title: string; objective: string; bloom_level?: string }) =>
    fetch(`${API}/modules`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(j),
  remove: (id: string) => fetch(`${API}/modules/${id}`, { method: "DELETE" }).then(j),
};

export async function streamTutorTurn(prompt: string, onChunk: (t: string) => void) {
  const res = await fetch(`${API}/tutor/turn`, { method: "POST" });
  if (!res.body) throw new Error("No stream");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}
