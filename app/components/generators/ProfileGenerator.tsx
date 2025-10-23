"use client";

import React, { useState, useRef } from "react";
import { RefreshCw, Download } from "lucide-react";

const COLOR_SCHEMES = ["Neutral", "Warm", "Cool", "Monochrome"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];
type Gender = "Male" | "Female" | "Non-binary" | "Other";

export default function ProfileGenerator() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [gender, setGender] = useState<Gender>("Male");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("Neutral");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Please upload a valid image file (PNG or JPEG).");
        setProfilePic(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        setProfilePic(null);
        return;
      }

      // Validate image dimensions
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Invalid image."));
        });
        if (img.width < 256 || img.height < 256) {
          setError("Image dimensions must be at least 256x256 pixels.");
          setProfilePic(null);
          return;
        }
        if (img.width > 2048 || img.height > 2048) {
          setError("Image dimensions must not exceed 2048x2048 pixels.");
          setProfilePic(null);
          return;
        }
      } catch {
        setError("Failed to validate image dimensions.");
        setProfilePic(null);
        return;
      }

      setError("");
      setProfilePic(file);
    }
  };

  const handleGenerate = async () => {
    if (!profilePic) {
      setError("Please upload a profile picture.");
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("gender", gender.toLowerCase());
      formData.append("colorScheme", colorScheme.toLowerCase());
      formData.append("profilePic", profilePic);

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific API errors
        if (res.status === 429) {
          throw new Error(
            "API quota exceeded. Please try again later or enable billing for higher limits."
          );
        }
        if (res.status === 400) {
          throw new Error(data.error || "Invalid input provided.");
        }
        throw new Error(data.error || "Failed to generate image.");
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("No image URL returned from the API.");
      }
    } catch (err) {
      console.error("Image generation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfilePic(null);
    setGender("Male");
    setColorScheme("Neutral");
    setImageUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Professional Headshot Generator
      </h1>
      <p className="text-base text-gray-700 mb-6">
        Upload a profile picture (PNG/JPEG, 256x256 to 2048x2048), select your gender and color scheme, and generate a professional LinkedIn-style headshot.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Inputs */}
        <section className="space-y-5">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              disabled={loading}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer p-2 focus:outline-none disabled:opacity-50"
            />
            {profilePic && (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              disabled={loading}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
              disabled={loading}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
            >
              {COLOR_SCHEMES.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-md">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !profilePic}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Headshot"
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700 disabled:opacity-50"
              title="Reset"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </section>

        {/* Right Section - Output */}
        <section>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Generated Headshot
          </label>
          <div className="min-h-[300px] rounded-lg border border-gray-300 p-4 bg-white flex flex-col items-center justify-center">
            {loading ? (
              <span className="text-gray-600 flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-gray-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Generating your professional headshot...
              </span>
            ) : imageUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={imageUrl}
                  alt="Generated Headshot"
                  className="rounded-lg border border-gray-300 max-w-full h-auto max-h-[400px]"
                />
                <a
                  href={imageUrl}
                  download="generated-headshot.png"
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  <Download size={16} className="mr-2" />
                  Download Headshot
                </a>
              </div>
            ) : (
              <span className="text-gray-500">
                Your generated headshot will appear here.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}