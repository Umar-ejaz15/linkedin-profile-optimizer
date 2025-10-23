// app/api/post/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const { mode, tone, length, input } = await req.json();

    if (!input?.trim()) {
      return NextResponse.json(
        { error: "Content is required." },
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

    // Determine word count based on length
    const wordCount = length === "Short" ? "100-150" : length === "Medium" ? "150-250" : "250-400";

    // Build prompt based on mode
    let prompt = "";
    
    if (mode === "Create New") {
      prompt = `You are a viral LinkedIn content creator who understands what makes posts perform exceptionally well. Create a highly engaging ${tone.toLowerCase()} LinkedIn post based on the following topic.

Topic/Idea:
${input.trim()}

Requirements:
- Length: ${wordCount} words (${length.toLowerCase()})
- Tone: ${tone.toLowerCase()} but always engaging and magnetic
- START with a powerful hook that stops the scroll (use pattern interrupt, controversial statement, surprising fact, or compelling question)
- Write in natural, human language - like you're talking to a colleague over coffee
- Use the "PAS" framework where appropriate: Problem → Agitate → Solution
- Break into short, punchy paragraphs (2-3 lines max per paragraph)
- Add strategic line breaks for visual appeal and easy scanning
- Use storytelling elements: personal experiences, specific examples, vivid details
- Include emotional triggers that resonate with professionals
- End with a strong call-to-action or thought-provoking question that encourages comments
- Avoid: corporate jargon, buzzwords, clichés like "game-changer" or "unlock potential"
- Write with confidence and authenticity - be human, not a corporate robot
- NO emojis - write purely with words
- NO special characters, symbols, or decorative elements (no arrows, bullets, stars, etc.)
- NO hashtags unless specifically mentioned in the topic
- Use plain text only - let the words do the work

HOOK EXAMPLES (choose style based on tone):
- "I made a $50k mistake last year. Here's what it taught me..."
- "Hot take: [Controversial but defensible opinion]"
- "Everyone says X. But here's what they're missing..."
- "3 years ago, I was [relatable struggle]. Today, [transformation]."
- "The uncomfortable truth about [topic] that no one talks about:"

Write ONLY the post content - no titles, labels, or explanations. Pure human writing that feels authentic and real.`;
    } else {
      prompt = `You are a viral LinkedIn content strategist who transforms mediocre posts into scroll-stopping content. Rewrite this post to maximize engagement while maintaining ${tone.toLowerCase()} tone.

Original Post:
${input.trim()}

Transformation Requirements:
- Target length: ${wordCount} words (${length.toLowerCase()})
- Tone: ${tone.toLowerCase()} but highly engaging
- COMPLETELY REWRITE the opening - create a magnetic hook that stops the scroll:
  * Use pattern interrupt (surprising statement, bold claim, question)
  * Tap into curiosity, emotion, or controversy
  * Make the first line irresistible to keep reading
- Restructure for maximum impact:
  * Short, punchy paragraphs (2-3 lines each)
  * Strategic line breaks for visual breathing room
  * Active voice and strong verbs
- Enhance storytelling: add specific details, personal elements, emotional resonance
- Remove all fluff, jargon, and corporate-speak
- Transform weak statements into powerful assertions
- End with a compelling CTA that drives comments (ask opinion, invite experience sharing, pose debate)
- Keep valuable hashtags but place them naturally or at the end
- Make every sentence earn its place - cut anything that doesn't add value
- Write in natural, human language that sounds authentic and real
- NO emojis - use words only
- NO special characters, symbols, or decorative elements (no arrows, bullets, stars, checkmarks, etc.)
- Use plain text only - let the authentic human voice shine through

HOOK TRANSFORMATION EXAMPLES:
Before: "Today I want to talk about leadership..."
After: "I watched my best manager quit last week. Here's the real reason why..."

Before: "Excited to share some insights about productivity..."
After: "I wasted 3 years being 'busy'. Here's what actually moved the needle..."

Write ONLY the transformed post - no meta-commentary. Pure, authentic human writing.`;
    }

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
    console.error("Post generation error:", error);

    let errorMessage = "Failed to generate post. Please try again.";
    
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