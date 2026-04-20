import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt requis" },
        { status: 400 }
      );
    }

    console.log("OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY);

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY manquante dans .env" },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en création de scripts vidéo. Réponds en français. Donne un script clair, structuré, engageant, avec hook, développement, call to action, et idées de plans caméra.",
        },
        {
          role: "user",
          content: `Crée un script vidéo professionnel pour : ${prompt}`,
        },
      ],
      max_tokens: 1000,
    });

    const result =
      completion.choices?.[0]?.message?.content || "Aucun résultat";

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("VIDEO SCRIPT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Erreur Video AI",
      },
      { status: 500 }
    );
  }
}