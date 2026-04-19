import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatLayout from "@/components/ChatLayout";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="h-screen bg-black text-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI SaaS Dashboard
            </h1>
            <p className="text-sm text-white/60">
              Bienvenue, {session.user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              Plan Free
            </div>

            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Top cards */}
        <section className="grid grid-cols-1 gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-sm text-white/50">Statut</p>
            <h2 className="mt-2 text-xl font-semibold">Connecté</h2>
            <p className="mt-1 text-sm text-white/60">
              Session active et prête à utiliser.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-sm text-white/50">Module principal</p>
            <h2 className="mt-2 text-xl font-semibold">AI Chat</h2>
            <p className="mt-1 text-sm text-white/60">
              Génération, amélioration de texte et outils IA.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-sm text-white/50">Base de données</p>
            <h2 className="mt-2 text-xl font-semibold">Synchronisée</h2>
            <p className="mt-1 text-sm text-white/60">
              Conversations et messages sauvegardés.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="min-h-0 flex-1">
          <ChatLayout />
        </section>
      </div>
    </main>
  );
}