"use client";

import { useState } from "react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImage("");
    setGeneratedPrompt("");
    setProvider("");
    setError("");

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur génération image");
        return;
      }

      setProvider(data.provider || "");

      if (data.mode === "image" && data.image) {
        setImage(data.image);
      }

      if (data.mode === "prompt" && data.prompt) {
        setGeneratedPrompt(data.prompt);
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="mb-2 text-3xl font-bold">🎨 Smart Image Prompt AI</h1>
      <p className="mb-6 text-white/60">
  Génère un prompt image professionnel avec IA (Gemini / OpenRouter).
</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: une villa futuriste au coucher du soleil, style réaliste"
          className="min-h-[160px] w-full rounded-xl bg-black p-4 text-white outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer"}
        </button>

        {provider && (
          <p className="mt-4 text-sm text-white/50">
            Provider utilisé : <span className="font-semibold">{provider}</span>
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400">
            ⚠️ {error}
          </p>
        )}

        {image && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Image générée</h2>
              <a
                href={image}
                download="generated-image.png"
                className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
              >
                Télécharger
              </a>
            </div>

            <img
              src={image}
              alt="Generated"
              className="rounded-xl border border-white/10"
            />
          </div>
        )}

        {!image && generatedPrompt && (
          <div className="mt-6 rounded-xl border border-white/10 bg-black p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Prompt généré</h2>

              <button
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
              >
                Copier
              </button>
            </div>

            <pre className="whitespace-pre-wrap text-white/70">
              {generatedPrompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}