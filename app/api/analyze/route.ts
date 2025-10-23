import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const sentences = content.split(/[.!?]/).filter(Boolean).length;
  const avgWords = sentences ? Math.round(words / sentences) : 0;

  // crude heuristic for clarity score
  const score = Math.max(30, Math.min(95, 100 - Math.abs(avgWords - 18)));
  const level =
    score > 85 ? "Excellent" : score > 70 ? "Good" : score > 55 ? "Fair" : "Needs Work";

  const readability =
    avgWords < 15 ? "Too short / choppy" :
    avgWords > 25 ? "Too long / dense" :
    "Balanced";

  const suggestions = [
    "Add 1–2 quantified results (e.g., 'Improved X by 20%').",
    "Use first-person for more authenticity.",
    "Highlight top 3 skills or tools explicitly.",
    "Avoid generic phrases like 'hard worker' or 'motivated'.",
  ];

  return NextResponse.json({ score, level, readability, suggestions });
}
