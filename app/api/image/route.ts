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
      return NextResponse.json(
        { error: "Prompt requis" },
        { status: 400 }
      );
    }

    // 1) OPENAI IMAGE RÉELLE
    if (process.env.OPENAI_API_KEY) {
      try {
        const result = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
        });

        const b64 = result.data?.[0]?.b64_json;

        if (b64) {
          return NextResponse.json({
            mode: "image",
            image: `data:image/png;base64,${b64}`,
            provider: "openai",
          });
        }
      } catch (error) {
        console.error("OPENAI IMAGE ERROR:", error);
      }
    }

    // 2) GEMINI PROMPT GENERATOR
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Tu es un expert en prompts d'image. Génère un prompt ultra détaillé, propre, visuel, professionnel, prêt à être utilisé dans une IA d'image. Réponds uniquement avec le prompt final.\n\nDemande utilisateur: ${prompt}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const geminiPrompt =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiPrompt) {
          return NextResponse.json({
            mode: "prompt",
            prompt: geminiPrompt,
            provider: "gemini",
          });
        }
      } catch (error) {
        console.error("GEMINI IMAGE PROMPT ERROR:", error);
      }
    }

    // 3) OPENROUTER FALLBACK
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const completion = await openrouter.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "Tu es un expert en prompts d'image. Génère un prompt ultra détaillé, professionnel, visuel et prêt à utiliser dans une IA d'image. Réponds uniquement avec le prompt final.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const generatedPrompt =
          completion.choices?.[0]?.message?.content || "";

        if (generatedPrompt) {
          return NextResponse.json({
            mode: "prompt",
            prompt: generatedPrompt,
            provider: "openrouter",
          });
        }
      } catch (error) {
        console.error("OPENROUTER IMAGE PROMPT ERROR:", error);
      }
    }

    return NextResponse.json(
      { error: "Aucun provider image disponible." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("SMART IMAGE ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur Smart Image AI" },
      { status: 500 }
    );
  }
}