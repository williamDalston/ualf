const BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
export class HttpError extends Error {
  status?: number; requestId?: string; body?: any;
  constructor(msg:string, opts?:{status?:number, requestId?:string, body?:any}){super(msg);Object.assign(this,opts);}
}
async function attempt(path:string, init?:RequestInit, timeoutMs=10000){
  const ctrl = new AbortController(); const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {...init, signal: ctrl.signal});
    const reqId = res.headers.get("x-request-id") || undefined;
    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const data = isJson ? await res.json() : await res.text();
    if (!res.ok) throw new HttpError(isJson ? data.message || "Request failed" : String(data), {status: res.status, requestId: reqId, body: data});
    return data;
  } finally { clearTimeout(t); }
}
export async function api(path:string, init?:RequestInit, retries=1){
  let lastErr: any;
  for (let i=0;i<=retries;i++){
    try { return await attempt(path, init); }
    catch(e){ lastErr=e; if (i<retries) await new Promise(r=>setTimeout(r, 300*(i+1))); }
  }
  throw lastErr;
}
