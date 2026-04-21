import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openrouter = new OpenAI({
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

    try {
      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });

      const b64 = result.data?.[0]?.b64_json;

      if (!b64) {
        throw new Error("Aucune image générée");
      }

      return NextResponse.json({
        mode: "image",
        image: `data:image/png;base64,${b64}`,
      });
    } catch (imageError: any) {
      console.error("IMAGE REAL ERROR:", imageError);

      const completion = await openrouter.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert en prompts d'image. Génère un prompt ultra détaillé, propre et professionnel en français.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return NextResponse.json({
        mode: "prompt",
        prompt:
          completion.choices?.[0]?.message?.content || "Aucun prompt généré",
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("IMAGE API ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur image" },
      { status: 500 }
    );
  }
}