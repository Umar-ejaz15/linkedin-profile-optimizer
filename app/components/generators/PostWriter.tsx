"use client";

import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const MODES = ["Create New", "Rewrite Existing"] as const;
const TONES = ["Professional", "Casual", "Inspirational", "Storytelling", "Bold"] as const;
const LENGTHS = ["Short", "Medium", "Long"] as const;

type Mode = typeof MODES[number];
type Tone = typeof TONES[number];
type Length = typeof LENGTHS[number];

export default function PostWriter() {
  const [mode, setMode] = useState<Mode>("Create New");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("Please enter some content.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, tone, length, input: trimmedInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate post");
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          LinkedIn Post Writer
        </h1>
        <p className="text-lg text-gray-600">
          Generate or rewrite LinkedIn posts with AI-powered creativity and professional tone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Input</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={length}
              onChange={(e) => setLength(e.target.value as Length)}
              className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            >
              {LENGTHS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "Create New"
                ? "Describe the idea or topic you want to post about..."
                : "Paste your LinkedIn post here to rewrite it..."
            }
            className="w-full min-h-[300px] rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white transition-colors"
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              {loading ? "Generating..." : "Generate Post"}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={handleCopy}
              disabled={!output}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Post</h2>
          <div className="min-h-[300px] rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-white whitespace-pre-wrap text-gray-900 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <span className="text-gray-600 font-medium">Generating your post...</span>
                <span className="text-gray-400 text-sm mt-2">This may take a few seconds</span>
              </div>
            ) : output ? (
              <div className="leading-relaxed">{output}</div>
            ) : (
              <div className="flex items-center justify-center min-h-[280px] text-center">
                <div>
                  <div className="text-5xl mb-4">✨</div>
                  <span className="text-gray-400 text-sm block">
                    Your generated post will appear here
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}