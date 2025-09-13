"use client";
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <div className="min-h-dvh grid place-items-center p-8">
          <div className="max-w-lg space-y-3 text-center">
            <h1 className="text-2xl font-bold">App Error</h1>
            <p className="text-sm opacity-80">{error.message}</p>
            {error.digest && <p className="text-xs opacity-60">ref: {error.digest}</p>}
            <button className="mt-4 rounded-lg border px-4 py-2" onClick={() => location.reload()}>
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
