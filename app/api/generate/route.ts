import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices?.[0]?.delta?.content || "";

            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Generate streaming error:", error);
    return new Response("Erreur pendant le streaming", { status: 500 });
  }
}