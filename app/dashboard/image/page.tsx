"use client";

import { useState } from "react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl("");
    setMessage("");

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
        setMessage(data.error || "Erreur génération image");
        return;
      }

      setImageUrl("");
      setMessage(data.result || "Aucun résultat");
    } catch (error) {
      setMessage("Erreur serveur image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">🖼️ Image AI</h1>
      <p className="mb-6 text-white/60">
        Génère une image à partir d’un prompt.
      </p>

      <div className="rounded-2xl border border-white/10 bg-black p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Exemple : une maison moderne de luxe au coucher du soleil, style réaliste, architecture premium"
          className="min-h-[180px] w-full rounded-xl bg-white/5 p-4 text-white outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer l’image"}
        </button>

        {message && (
          <p className="mt-4 text-red-400">{message}</p>
        )}

        {imageUrl && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">Image générée</h2>
            <img
              src={imageUrl}
              alt="Image générée"
              className="w-full rounded-2xl border border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  );
}