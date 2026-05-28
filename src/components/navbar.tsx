"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Bell } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {session?.user?.role === "ADMIN" && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-white flex items-center justify-center">
                <div className="h-3 w-3 bg-black rounded-sm" />
              </div>
              <span className="font-bold tracking-tight text-white">Quota</span>
            </Link>
          )}

          {session?.user?.role === "ADMIN" && pathname.startsWith("/admin") && (
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
              <span className="h-4 w-px bg-zinc-800" />
              <span className="text-zinc-300">Administration</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-zinc-800" />

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-white">
                {session?.user?.name}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {session?.user?.role === "ADMIN" ? "Administrator" : "Sales Officer"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-zinc-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
