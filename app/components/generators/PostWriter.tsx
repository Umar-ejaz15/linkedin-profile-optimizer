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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">LinkedIn Post Writer</h1>
      <p className="text-base text-gray-700 mb-6">
        Generate or rewrite LinkedIn posts with a specific tone and length.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <section>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={length}
              onChange={(e) => setLength(e.target.value as Length)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
            className="w-full min-h-[280px] rounded-lg border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
          />

          {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
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
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Generated Post
          </label>
          <div className="min-h-[280px] rounded-lg border border-gray-300 p-3 bg-white whitespace-pre-wrap text-gray-900">
            {loading ? (
              <span className="text-gray-600">Generating your post...</span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-500">
                Your generated post will appear here.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}