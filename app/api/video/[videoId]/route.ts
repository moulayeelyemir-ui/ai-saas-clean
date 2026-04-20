import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  context: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await context.params;

    const res = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Erreur statut vidéo" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("VIDEO STATUS ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur vidéo" },
      { status: 500 }
    );
  }
}