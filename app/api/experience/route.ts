// app/api/experience/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const { role, description, tone = "Professional" } = await req.json();

    if (!role?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Both role and description are required." },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in .env.local");
      return NextResponse.json(
        { error: "Server configuration error. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey });

    // Build prompt for experience writing
    const prompt = `You are a professional resume writer specializing in creating achievement-based experience descriptions.

Role: ${role.trim()}
Duties/Responsibilities: ${description.trim()}

Create a ${tone.toLowerCase()} LinkedIn experience section with these requirements:

Requirements:
- Transform duties into measurable, achievement-based bullet points
- Dont Start each bullet but with a strong action verb
- Include quantifiable results, metrics, or impact when possible (if not provided, use realistic estimates like "10+", "50%", etc.)
- Write 3-4 bullet points
- Keep it concise and powerful
- Use natural, human language - avoid AI-sounding phrases
- Format as bullet points with • symbol
- Focus on accomplishments and impact, not just responsibilities

Write ONLY the bullet points, no additional commentary or explanations.`;

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const result = response.text?.trim();

    if (!result) {
      throw new Error("No output generated from API");
    }

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error("Experience generation error:", error);

    let errorMessage = "Failed to generate experience. Please try again.";
    
    if (error.message?.includes("API_KEY") || error.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your GEMINI_API_KEY.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}