"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { name: "Image AI", href: "/dashboard/image", icon: "🖼️" },
  { name: "Chat AI", href: "/dashboard/chat", icon: "💬" },
  { name: "Video AI", href: "/dashboard/video", icon: "🎥" },
  { name: "Analyse fichiers", href: "/dashboard/files", icon: "📄" },
  { name: "Website AI", href: "/dashboard/website", icon: "🌐" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-white/10 bg-black p-4 text-white">
      <h2 className="mb-6 text-2xl font-bold">AI SaaS</h2>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-white text-black"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}