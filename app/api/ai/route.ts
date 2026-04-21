import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    // 🔥 1. GEMINI FIRST
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();

      if (data?.candidates?.length) {
        return NextResponse.json({
          provider: "gemini",
          result: data.candidates[0].content.parts[0].text,
        });
      }
    } catch (err) {
      console.log("Gemini failed → fallback OpenRouter");
    }

    // 🔵 2. FALLBACK OPENROUTER
    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      provider: "openrouter",
      result: completion.choices?.[0]?.message?.content,
    });
  } catch (error: any) {
    console.error("AI ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Erreur AI" },
      { status: 500 }
    );
  }
}