"use client";

import { useState } from "react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImage("");
    setGeneratedPrompt("");
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

      // 🔴 إذا API key غلط
      if (!res.ok) {
        setError(data.error || "Erreur génération image");

        // fallback → عرض prompt فقط
        setGeneratedPrompt(prompt);
        return;
      }

      // ✅ صورة حقيقية
      if (data.image) {
        setImage(data.image);
      }

      // 🧠 fallback prompt generator
      if (data.prompt) {
        setGeneratedPrompt(data.prompt);
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">🎨 Image AI</h1>
      <p className="text-white/60 mb-6">
        Génère une image à partir d’un prompt ou crée un prompt professionnel.
      </p>

      {/* BOX */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: une maison futuriste au coucher du soleil"
          className="w-full min-h-[160px] bg-black rounded-xl p-4 outline-none text-white"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer l’image"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 mt-4 text-sm">
            ⚠️ {error}
          </p>
        )}

        {/* IMAGE RESULT */}
        {image && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Résultat</h2>

            <img
              src={image}
              alt="Generated"
              className="rounded-xl border border-white/10"
            />

            <button
              onClick={() => window.open(image, "_blank")}
              className="mt-3 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10"
            >
              Télécharger
            </button>
          </div>
        )}

        {/* PROMPT RESULT */}
        {!image && generatedPrompt && (
          <div className="mt-6 bg-black border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Prompt généré</h2>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(generatedPrompt)
                }
                className="text-sm border px-3 py-1 rounded-lg hover:bg-white/10"
              >
                Copier
              </button>
            </div>

            <pre className="text-white/70 whitespace-pre-wrap">
              {generatedPrompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}