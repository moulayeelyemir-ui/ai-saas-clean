import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await context.params;
    const body = await req.json();
    const role = String(body?.role || "");
    const content = String(body?.content || "");

    if (!role || !content) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        role,
        content,
        chatId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Save message error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await context.params;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}