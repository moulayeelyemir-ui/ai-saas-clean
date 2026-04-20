import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en génération d'images. Génère un prompt ultra détaillé pour une IA d'image.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur image AI" }, { status: 500 });
  }
}