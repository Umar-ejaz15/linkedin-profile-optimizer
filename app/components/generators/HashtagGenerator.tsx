"use client";

import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const STRATEGIES = ["Trending", "Niche", "Mixed", "Industry-Specific", "Engagement-Focused"] as const;
type Strategy = typeof STRATEGIES[number];

export default function HashtagGenerator() {
  const [strategy, setStrategy] = useState<Strategy>("Mixed");
  const [post, setPost] = useState("");
  const [industry, setIndustry] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const trimmedPost = post.trim();
    
    if (!trimmedPost) {
      setError("Please enter your post content to generate hashtags.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    const inputData = {
      post: trimmedPost,
      industry: industry.trim(),
    };

    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputData, strategy }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate hashtags");
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
    setPost("");
    setIndustry("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">LinkedIn Hashtag Generator</h1>
      <p className="text-base text-gray-700 mb-6">
        Generate relevant hashtags for your LinkedIn post to maximize reach and engagement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <section className="space-y-4">
          <label className="block text-sm font-semibold mb-2 text-gray-900">Post Details</label>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Your Post Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="Paste your LinkedIn post here... (e.g., Just launched our new AI-powered productivity tool! After 6 months of development, we're excited to help teams work smarter...)"
              className="w-full min-h-[180px] rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Industry/Niche (Optional)
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., SaaS, Marketing, Web Development, Finance"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {STRATEGIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              {loading ? "Generating..." : "Generate Hashtags"}
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
          <label className="block text-sm font-semibold mb-2 text-gray-900">Generated Hashtags</label>
          <div className="min-h-[300px] rounded-lg border border-gray-300 p-4 bg-white whitespace-pre-wrap text-gray-900">
            {loading ? (
              <span className="text-gray-600">Finding the best hashtags for your post...</span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-500">
                Your generated hashtags will appear here. Enter your post content and click Generate Hashtags.
              </span>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700">
              <strong className="text-gray-900">💡 Pro Tip:</strong> LinkedIn recommends 3-5 hashtags per post. Mix popular hashtags (100K+ followers) with niche ones (10K-50K) for best reach.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}