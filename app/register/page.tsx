"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || "Erreur");
        return;
      }

      setMessage("Compte créé avec succès ✅");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setLoading(false);
      setMessage("Erreur réseau");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl space-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-white">
          Créer un compte
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-black outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-black outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Création..." : "S'inscrire"}
        </button>

        {message && (
          <p className="text-center text-sm text-white">{message}</p>
        )}
      </form>
    </main>
  );
}