"use client";

import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const TONES = ["Professional", "Impactful", "Confident", "Casual", "Concise"] as const;
type Tone = typeof TONES[number];

export default function ExperienceWriter() {
  const [tone, setTone] = useState<Tone>("Professional");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const trimmedRole = role.trim();
    const trimmedDescription = description.trim();

    if (!trimmedRole || !trimmedDescription) {
      setError("Please fill in both role and description.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role: trimmedRole, 
          description: trimmedDescription, 
          tone 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate experience");
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
    setRole("");
    setDescription("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900"> Experience Writer</h1>
      <p className="text-base text-gray-700 mb-6">
        Turn your job role and duties into measurable, achievement-based experience bullets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <section>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Role / Position
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Data Analyst at XYZ Corp"
            className="w-full rounded-lg border border-gray-300 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
          />

          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Duties / Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="- Created dashboards&#10;- Cleaned data&#10;- Improved KPIs"
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
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Generated Achievements
          </label>
          <div className=" rounded-lg border border-gray-300 p-3 bg-white whitespace-pre-wrap text-gray-900">
            {loading ? (
              <span className="text-gray-600">Generating your achievements...</span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-500">
                Generated achievements will appear here.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}