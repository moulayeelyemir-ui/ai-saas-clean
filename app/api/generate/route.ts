import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 30000, // 30 secondes
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Messages requis" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        {
          role: "system",
          content: `
          Tu es un assistant pédagogique.
          Réponds toujours en français.
          Donne une réponse longue, détaillée et bien structurée.
          Utilise :
          - un titre
          - plusieurs paragraphes
          - des exemples
          - une conclusion
          Ne réponds jamais en une réponse courte.
                `,},
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 700,
      stream: false,
    });

    const result =
      response.choices?.[0]?.message?.content?.trim() ||
      "Aucune réponse générée";

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Generate API error:", error);

    const joinedPrompt = Array.isArray(error) ? "" : null;

    if (
      error?.message?.includes("timed out") ||
      error?.code === "ETIMEDOUT"
    ) {
      return NextResponse.json({
        result:
          "Réponse de démonstration : le provider IA a mis trop de temps à répondre. Essaie un prompt plus court ou change de modèle OpenRouter.",
        fallback: true,
      });
    }

    return NextResponse.json(
      {
        error: error?.message || "Erreur IA",
      },
      { status: 500 }
    );
  }
}