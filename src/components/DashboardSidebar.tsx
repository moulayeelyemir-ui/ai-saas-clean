"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  Image as ImageIcon,
  FileText,
  Globe,
  Sparkles,
} from "lucide-react";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat AI", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Video AI", href: "/dashboard/video", icon: Video },
  { name: "Image AI", href: "/dashboard/image", icon: ImageIcon },
  { name: "Analyse fichiers", href: "/dashboard/files", icon: FileText },
  { name: "Website AI", href: "/dashboard/website", icon: Globe },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-[#050505] p-5 text-white">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-white p-2 text-black">
          <Sparkles size={20} />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nova AI</h2>
          <p className="text-sm text-white/40">Creative SaaS Studio</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                active
                  ? "bg-white text-black shadow-sm"
                  : "bg-white/[0.03] text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon size={20} className={active ? "text-black" : "text-white/70"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold">Plan Premium</p>
        <p className="mt-1 text-xs text-white/50">
          Chat, image, vidéo, analyse fichiers et génération de sites.
        </p>
      </div>
    </aside>
  );
}