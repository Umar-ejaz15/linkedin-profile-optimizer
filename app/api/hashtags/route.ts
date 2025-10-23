// app/api/hashtags/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const { input, strategy = "Mixed" } = await req.json();

    if (!input?.post?.trim()) {
      return NextResponse.json(
        { error: "Post content is required." },
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

    // Build input summary
    const inputSummary = `
Post Content: ${input.post}
${input.industry ? `Industry/Niche: ${input.industry}` : ''}
    `.trim();

    // Build prompt for hashtag generation
    const prompt = `You are a LinkedIn hashtag strategist. Generate relevant hashtags for the following LinkedIn post using a ${strategy.toLowerCase()} strategy.

Requirements:
- Generate 8-12 hashtags that are highly relevant to the post content
- Use the ${strategy.toLowerCase()} strategy:
  ${strategy === "Trending" ? "- Focus on popular, high-volume hashtags (100K+ followers)\n  - Include current trending topics" : ""}
  ${strategy === "Niche" ? "- Focus on specific, targeted hashtags (10K-50K followers)\n  - Target specialized audiences and communities" : ""}
  ${strategy === "Mixed" ? "- Balance popular hashtags (100K+) with niche ones (10K-50K)\n  - 3-4 broad hashtags + 5-6 specific ones" : ""}
  ${strategy === "Industry-Specific" ? "- Focus heavily on industry-specific hashtags\n  - Include professional communities and trade-specific tags" : ""}
  ${strategy === "Engagement-Focused" ? "- Prioritize hashtags known for high engagement rates\n  - Mix of medium-sized communities (20K-80K followers)" : ""}
- Format: Each hashtag on a new line starting with #
- No explanations or categories - just the hashtags
- Make hashtags relevant and natural - avoid generic ones like #success #motivation unless they fit the post
- Prioritize hashtags that LinkedIn users actually search for and follow
- Consider the industry context if provided

${inputSummary}

Important: Write ONLY the hashtags, one per line, starting with #. No additional text, explanations, or commentary.

Example format:
#WebDevelopment
#ReactJS
#FrontendDev
#JavaScript
#TechCareers`;

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
    console.error("Hashtag generation error:", error);

    let errorMessage = "Failed to generate hashtags. Please try again.";
    
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