import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold">AI SaaS</h1>

        <div className="space-x-4">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col justify-center items-center text-center px-6">
        <h2 className="text-5xl font-bold mb-6">
          Build your AI SaaS 🚀
        </h2>

        <p className="text-lg text-white/70 max-w-xl mb-8">
          Generate content with AI, manage your history, and build your own SaaS platform.
        </p>

        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-12">
        <div className="border border-white/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">🤖 AI Generator</h3>
          <p className="text-white/70">
            Generate text using AI prompts instantly.
          </p>
        </div>

        <div className="border border-white/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">💾 History</h3>
          <p className="text-white/70">
            Save and manage all your generations.
          </p>
        </div>

        <div className="border border-white/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">🔐 Auth</h3>
          <p className="text-white/70">
            Secure login & user sessions.
          </p>
        </div>
      </section>
    </main>
  );
}