"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function ProfileAnalyzer() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setAnalysis({ error: "❌ Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setInput("");
    setAnalysis(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">🧠 Profile Analyzer</h1>
      <p className="text-sm text-slate-500 mb-6">
        Paste your full LinkedIn “About”, headline, or a recent role — get clarity and strength feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <section>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your LinkedIn About section or bio here..."
            className="w-full min-h-[220px] rounded-lg border p-3 resize-none"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>

            <button onClick={handleReset} className="px-3 py-2 rounded-lg border">
              <RefreshCw size={16} />
            </button>
          </div>
        </section>

        {/* Output */}
        <section>
          <label className="block text-sm font-medium mb-2">Analysis</label>
          <div className="min-h-[220px] rounded-lg border p-3 bg-white whitespace-pre-wrap text-sm">
            {analysis ? (
              analysis.error ? (
                <span className="text-red-500">{analysis.error}</span>
              ) : (
                <>
                  <p>
                    <strong>Score:</strong> {analysis.score}/100 ({analysis.level})
                  </p>
                  <p className="mt-2">
                    <strong>Readability:</strong> {analysis.readability}
                  </p>
                  <p className="mt-2">
                    <strong>Suggestions:</strong>
                  </p>
                  <ul className="list-disc list-inside text-slate-700">
                    {analysis.suggestions.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )
            ) : (
              <span className="text-slate-400">Your profile feedback will appear here.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
