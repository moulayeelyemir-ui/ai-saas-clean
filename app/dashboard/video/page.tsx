"use client";

import { useState } from "react";

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erreur Video AI");
        return;
      }

      setResult(data.result || "Aucun résultat");
    } catch {
      setErrorMessage("Erreur lors de la génération du script vidéo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h1 className="mb-2 text-3xl font-bold">🎥 Video Script AI</h1>
      <p className="mb-6 text-white/60">
        Génère des scripts vidéo professionnels pour TikTok, Reels, Shorts ou pub.
      </p>

      <div className="rounded-2xl border border-white/10 bg-black p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Exemple : crée un script TikTok pour présenter une agence immobilière premium"
          className="min-h-[180px] w-full rounded-xl bg-white/5 p-4 text-white outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer le script"}
        </button>

        {errorMessage && (
          <p className="mt-4 text-red-400">{errorMessage}</p>
        )}

        {result && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Résultat</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
              >
                Copier
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-white/80">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}