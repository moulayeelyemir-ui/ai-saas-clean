import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="mb-4 text-3xl font-bold">
              🚀 Bienvenue dans ton AI SaaS
            </h1>

            <p className="mb-6 text-white/70">
              Utilise le menu à gauche pour accéder à Chat AI, Video AI, Analyse de fichiers et Website Builder.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black p-5">
                <h2 className="text-lg font-semibold">💬 Chat AI</h2>
                <p className="mt-2 text-sm text-white/60">
                  Discute avec l’intelligence artificielle
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black p-5">
                <h2 className="text-lg font-semibold">🎥 Video AI</h2>
                <p className="mt-2 text-sm text-white/60">
                  Génère des idées et scripts vidéo
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black p-5">
                <h2 className="text-lg font-semibold">📄 Files AI</h2>
                <p className="mt-2 text-sm text-white/60">
                  Analyse les PDF et documents
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black p-5">
                <h2 className="text-lg font-semibold">🌐 Website AI</h2>
                <p className="mt-2 text-sm text-white/60">
                  Crée des structures de sites web
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}