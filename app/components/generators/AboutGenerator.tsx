"use client";

import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const TONES = ["Professional", "Casual", "Confident", "Creative", "Storytelling"] as const;
type Tone = typeof TONES[number];

export default function AboutGenerator() {
  const [tone, setTone] = useState<Tone>("Professional");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    
    if (!trimmedName || !trimmedRole) {
      setError("Please fill in at least your name and current role.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    const inputData = {
      name: trimmedName,
      role: trimmedRole,
      experience: experience.trim(),
      skills: skills.trim(),
      achievements: achievements.trim(),
    };

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputData, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate About section");
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
    setName("");
    setRole("");
    setExperience("");
    setSkills("");
    setAchievements("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">LinkedIn About Section Generator</h1>
      <p className="text-base text-gray-700 mb-6">
        Create a compelling LinkedIn About section that showcases your professional story and expertise.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <section className="space-y-4">
          <label className="block text-sm font-semibold mb-2 text-gray-900">Your Information</label>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Current Role/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Full Stack Developer | Product Designer"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Experience & Background
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 5+ years in software development, worked at tech startups, specialized in e-commerce platforms..."
              className="w-full min-h-[80px] rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Key Skills & Expertise
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, Node.js, Python, Team Leadership, Agile Development..."
              className="w-full min-h-[80px] rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Achievements & Impact
            </label>
            <textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="e.g., Built products used by 100K+ users, reduced load time by 60%, led team of 8 developers..."
              className="w-full min-h-[80px] rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 pt-2">
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
              {loading ? "Generating..." : "Generate About"}
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
          <label className="block text-sm font-semibold mb-2 text-gray-900">Generated About Section</label>
          <div className="min-h-[500px] rounded-lg border border-gray-300 p-4 bg-white whitespace-pre-wrap text-gray-900">
            {loading ? (
              <span className="text-gray-600">Crafting your professional story...</span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-500">
                Your generated LinkedIn About section will appear here. Fill in your information and click Generate About.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}