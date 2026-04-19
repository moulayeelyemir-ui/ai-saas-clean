"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour 👋 Pose ta question !" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!prompt.trim()) return;
  
    const newMessages = [
      ...messages,
      { role: "user", content: prompt },
    ];
  
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);
  
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
    });
  
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
  
    let aiMessage = "";
  
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
  
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
  
      const chunk = decoder.decode(value);
      aiMessage += chunk;
  
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = aiMessage;
        return updated;
      });
    }
  
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-2xl font-bold">AI Generator</h2>

      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea
          placeholder="Écris ton prompt ici..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[180px] w-full rounded-xl border border-white/10 bg-black p-4 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-5 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Génération..." : "Generate"}
        </button>
        <p className="whitespace-pre-wrap text-white/80 animate-pulse">
  {result}
</p>
      </form>

      {message && (
        <p className="mt-4 text-red-400">{message}</p>
      )}

{result && (
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 className="mb-4 text-xl font-semibold">Résultat</h2>

    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{result}</ReactMarkdown>
    </div>
  </div>
)}
    </div>
  );
}