import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert UI/UX et développement web. Réponds en français. Propose une structure professionnelle de site, des sections, un style, puis un exemple de code React/Tailwind simple.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1200,
    });

    const result =
      completion.choices?.[0]?.message?.content || "Aucun résultat";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("GENERATE SITE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur génération site" },
      { status: 500 }
    );
  }
}