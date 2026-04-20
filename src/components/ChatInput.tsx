"use client";

import { useState } from "react";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

type ChatInputProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentChatId: string | null;
};

export default function ChatInput({
  messages,
  setMessages,
  currentChatId,
}: ChatInputProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveMessage = async (
    chatId: string,
    role: string,
    content: string
  ) => {
    await fetch(`/api/chat/${chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, content }),
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || !currentChatId || loading) return;

    const userPrompt = prompt.trim();
    setPrompt("");
    setLoading(true);
    setErrorMessage("");

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: userPrompt },
    ];

    setMessages(nextMessages);

    try {
      await saveMessage(currentChatId, "user", userPrompt);

      const assistantIndex = nextMessages.length;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Erreur de génération");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = {
            role: "assistant",
            content: fullText,
          };
          return updated;
        });
      }

      await saveMessage(currentChatId, "assistant", fullText);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur réseau ou provider IA");
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!prompt.trim()) return;

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erreur lors de l'amélioration");
        return;
      }

      setPrompt(data.result || prompt);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur réseau pendant l'amélioration");
    }
  };

  const handleVoice = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognitionClass) {
      setErrorMessage(
        "La reconnaissance vocale n'est pas supportée sur ce navigateur."
      );
      return;
    }
  
    const recognition = new SpeechRecognitionClass();
  
    recognition.lang = "fr-FR";
    recognition.start();
  
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
    };
  
    recognition.onerror = () => {
      setErrorMessage("Erreur pendant la reconnaissance vocale.");
    };
  };

  return (
    <div className="border-t border-white/10 bg-black p-4">
      {errorMessage && (
        <p className="mb-3 text-sm text-red-400">{errorMessage}</p>
      )}

      <form
        onSubmit={handleSend}
        className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend(e);
            }
          }}
          placeholder="Pose ta question..."
          rows={2}
          className="w-full resize-none rounded-xl bg-transparent p-3 text-white outline-none placeholder:text-white/40"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleVoice}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              🎤 Voice
            </button>

            <button
              type="button"
              onClick={handleImprove}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              ✨ Improve
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !currentChatId}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p className="mt-2 text-xs text-white/40">
          Entrée pour envoyer · Shift + Entrée pour nouvelle ligne
        </p>
      </form>
    </div>
  );
}