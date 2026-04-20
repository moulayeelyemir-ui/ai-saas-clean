import { NextResponse } from "next/server";
import OpenAI from "openai";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result?.text?.trim() || "";

    console.log("TEXT LENGTH:", text.length);
    console.log("TEXT PREVIEW:", text.slice(0, 200));

    if (!text) {
      return NextResponse.json({
        result: "Aucun texte détecté dans le PDF.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        {
          role: "user",
          content: `Analyse ce document PDF et fais un résumé clair en français :\n\n${text.slice(0, 8000)}`,
        },
      ],
    });

    const summary =
      completion.choices?.[0]?.message?.content || "Aucun résultat";

    return NextResponse.json({ result: summary });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur analyse PDF" },
      { status: 500 }
    );
  }
}