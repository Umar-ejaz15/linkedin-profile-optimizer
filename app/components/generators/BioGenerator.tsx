"use client";

import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const TONES = ["Professional", "Casual", "Confident", "Creative", "Brief"] as const;
type Tone = typeof TONES[number];

export default function BioGenerator() {
  const [tone, setTone] = useState<Tone>("Professional");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      setError("Please enter something to generate a bio.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmedInput, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate bio");
      }

      setOutput(data.result || "No output generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">About / Bio Generator</h1>
      <p className="text-base text-gray-700 mb-6">
        Generate your LinkedIn About section with a tone of your choice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <section>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a few sentences or bullet points about yourself..."
            className="w-full min-h-[220px] rounded-lg border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
          />

          {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700"
              title="Reset"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={handleCopy}
              disabled={!output}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-gray-700"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Output</label>
          <div className="min-h-[220px] rounded-lg border border-gray-300 p-3 bg-white whitespace-pre-wrap text-gray-900">
            {loading ? (
              <span className="text-gray-600">Generating your bio...</span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-500">
                Your generated bio will appear here.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}