// app/api/about/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const { input, tone = "Professional" } = await req.json();

    if (!input?.name?.trim() || !input?.role?.trim()) {
      return NextResponse.json(
        { error: "Name and role are required." },
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

    // Build comprehensive input summary
    const inputSummary = `
Name: ${input.name}
Current Role: ${input.role}
${input.experience ? `Experience: ${input.experience}` : ''}
${input.skills ? `Skills: ${input.skills}` : ''}
${input.achievements ? `Achievements: ${input.achievements}` : ''}
    `.trim();

    // Build prompt for LinkedIn About section
    const prompt = `You are a professional LinkedIn profile writer specializing in compelling About sections. Write a ${tone.toLowerCase()} LinkedIn "About" section based on the following information.

Requirements:
- Write 2-3 paragraphs that tell a cohesive professional story
- Start with a strong hook that captures attention or somethign which show professtionalizsim for linkedin 
- Weave in their experience, skills, and achievements naturally
- Make it engaging, authentic, and human - avoid corporate buzzwords
- Use first-person perspective (I, my, me)
- Show personality while maintaining professionalism
- Focus on value they bring and problems they solve
- End with a clear call-to-action or invitation to connect
- Keep total length between 1000-1300 characters
- Write in a conversational, natural tone - avoid AI-sounding phrases
- No bullet points - write as flowing paragraphs

${inputSummary}

Important: Write ONLY the About section text, no additional commentary, explanations, or meta-text. Start directly with the first paragraph.`;

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
    console.error("About section generation error:", error);

    let errorMessage = "Failed to generate About section. Please try again.";
    
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