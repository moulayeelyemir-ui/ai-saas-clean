"use client";

import ReactMarkdown from "react-markdown";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
  // 🔊 lecture audio
  const speak = (text: string) => {
    speechSynthesis.cancel(); // stop précédent
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  // ⛔ stop audio
  const stop = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-3xl rounded-2xl p-4 shadow-md ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            {/* contenu markdown */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            {/* actions */}
            <div className="flex gap-3 mt-3 text-xs">
              <button
                onClick={() => speak(msg.content)}
                className="text-blue-400 hover:underline"
              >
                🔊 Lire
              </button>

              <button
                onClick={stop}
                className="text-red-400 hover:underline"
              >
                ⛔ Stop
              </button>

              <button
                onClick={() => navigator.clipboard.writeText(msg.content)}
                className="text-green-400 hover:underline"
              >
                📋 Copier
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}