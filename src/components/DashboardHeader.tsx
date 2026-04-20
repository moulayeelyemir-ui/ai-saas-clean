export default function DashboardHeader() {
    return (
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-6 py-4 text-white">
        <div>
          <h1 className="text-2xl font-bold">AI SaaS Dashboard</h1>
          <p className="text-sm text-white/50">
            Chat, vidéo, fichiers et création de sites
          </p>
        </div>
  
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            Logout
          </button>
        </form>
      </header>
    );
  }