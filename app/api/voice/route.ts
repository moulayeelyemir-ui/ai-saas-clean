import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Texte requis" },
        { status: 400 }
      );
    }

    // 🔥 API gratuite navigateur (fallback)
    return NextResponse.json({
      text,
      note: "Utiliser SpeechSynthesis côté frontend",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur Voice AI" },
      { status: 500 }
    );
  }
}