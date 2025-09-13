"use client";
export default function GlobalError({ error, reset }: { error: any; reset: () => void; }) {
  return (
    <html>
      <body className="p-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{String(error?.message || error)}</pre>
          <button onClick={reset} className="rounded bg-black text-white px-4 py-2">Try again</button>
        </div>
      </body>
    </html>
  );
}
