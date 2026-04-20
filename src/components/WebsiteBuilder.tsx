"use client";

import { useState } from "react";

export default function WebsiteBuilder() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSite = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data.result || "Aucun résultat");
    } catch (error) {
      setResult("Erreur lors de la génération du site.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h2 className="mb-2 text-2xl font-bold">AI Website Builder</h2>
      <p className="mb-6 text-white/60">
        Décris ton site web et l’IA te proposera une structure professionnelle.
      </p>

      <div className="rounded-2xl border border-white/10 bg-black p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Exemple : crée un site vitrine professionnel pour une agence immobilière avec hero section, services, témoignages, FAQ et formulaire de contact..."
          className="min-h-[220px] w-full rounded-xl bg-white/5 p-4 text-white outline-none placeholder:text-white/40"
        />

        <button
          onClick={generateSite}
          disabled={loading}
          className="mt-4 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer le site"}
        </button>

        {result && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-semibold">Résultat généré</h3>
            <pre className="whitespace-pre-wrap text-sm text-white/80">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}