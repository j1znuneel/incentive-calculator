"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Car, 
  Layers, 
  History, 
  BarChart3,
  Settings,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin?tab=inventory", label: "Inventory", icon: Car },
    { href: "/admin?tab=slabs", label: "Incentive Slabs", icon: Layers },
    { href: "/settings", label: "System Settings", icon: Settings },
  ];

  const salesLinks = [
    { href: "/sales", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sales/history", label: "Sales History", icon: History },
    { href: "/sales/performance", label: "Performance", icon: BarChart3 },
  ];

  const links = role === "ADMIN" ? adminLinks : salesLinks;

  if (role === "ADMIN") return null;

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <div className="h-4 w-4 bg-black rounded-sm" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">Incentive Hub</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="pb-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 group",
                  isActive 
                    ? "bg-zinc-900 text-white font-medium" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={cn(
                    "h-4 w-4",
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                  )} />
                  {link.label}
                </div>
                {isActive && <ChevronRight className="h-3 w-3 text-zinc-600" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
          <p className="text-xs font-medium text-zinc-300">Enterprise Plan</p>
          <p className="text-[10px] text-zinc-500 mt-1">Management Dashboard v1.0</p>
        </div>
      </div>
    </aside>
  );
}
