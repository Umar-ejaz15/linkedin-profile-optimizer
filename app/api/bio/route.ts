// app/api/bio/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const { input, tone = "Professional" } = await req.json();

    if (!input?.trim()) {
      return NextResponse.json(
        { error: "Input is required." },
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

    // Build prompt for better bio generation
     const prompt = `You are a professional LinkedIn bio writer. Write a compelling ${tone.toLowerCase()} LinkedIn "About" section based on the following information.

Requirements:
- Make it engaging, authentic, and suitable for a professional profile
- Write in a natural, human-like tone - avoid AI-sounding language like no dashes no comas yu can use & or | 
- Keep it linear and straight to the point
- it should not contain my name just stright forward one liner pattern which shows where im good at 
- No fluff or buzzwords
- Write as one continuous narrative without bullet points

example: 
Next.js & MERN Stack Developer | Crafting Scalable Web Solutions 

use the above one as an example and write other bio like that and my checrters length of example is perfect make sure whatever youw rite should be fit here but it should not be more then two sentences likle if there arre two skills use & or | and add a catching line only one line is enough seperted by | this 
this should be enough:  ass example stright forward skills specific 


${input.trim()}

Important: Write ONLY the bio text, no additional commentary or explanations.`;

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
    console.error("Bio generation error:", error);

    let errorMessage = "Failed to generate bio. Please try again.";
    
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