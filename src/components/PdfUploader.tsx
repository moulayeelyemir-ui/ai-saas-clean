"use client";

import { useState } from "react";

export default function PdfUploader() {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result || "aucun resultat");
    } catch (error) {
      setResult("Erreur lors de l’analyse du fichier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h2 className="mb-2 text-2xl font-bold">Analyse de PDF / fichiers</h2>
      <p className="mb-6 text-white/60">
        Ajoute un PDF ou un document texte pour l’analyser avec l’IA.
      </p>

      <div className="rounded-2xl border border-dashed border-white/20 bg-black p-6">
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleUpload}
          className="mb-4 block w-full text-sm text-white/70"
        />

        {fileName && (
          <p className="mb-3 text-sm text-white/50">
            Fichier sélectionné : {fileName}
          </p>
        )}

        {loading && (
          <p className="text-sm text-blue-400">Analyse en cours...</p>
        )}

        {!loading && result && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-semibold">Résultat</h3>
            <p className="whitespace-pre-wrap text-white/80">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}