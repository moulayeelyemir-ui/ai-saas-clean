"use client";

import { useEffect, useState } from "react";

type Generation = {
  id: string;
  prompt: string;
  response: string;
  createdAt?: string;
};

export default function History() {
  const [data, setData] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-2xl font-bold">Historique</h2>

      {loading && <p className="text-white/70">Chargement...</p>}

      {!loading && data.length === 0 && (
        <p className="text-white/70">Aucune génération pour le moment</p>
      )}

      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/10 bg-black p-4"
          >
            <p className="mb-1 text-sm text-white/50">Prompt</p>
            <p className="mb-3">{item.prompt}</p>

            <p className="mb-1 text-sm text-white/50">Réponse</p>
            <p className="whitespace-pre-wrap text-white/80">
              {item.response}
            </p>

            {item.createdAt && (
              <p className="mt-3 text-xs text-white/40">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}