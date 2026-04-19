"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setMessage("Email ou mot de passe incorrect");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl space-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-white">
          Connexion
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
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {message && (
          <p className="text-center text-sm text-red-400">{message}</p>
        )}

        <p className="text-center text-sm text-white/80">
          Pas encore de compte ?{" "}
          <a href="/register" className="underline">
            Créer un compte
          </a>
        </p>
      </form>
    </main>
  );
}