"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Bell } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="px-8 flex h-16 items-center justify-end gap-6">
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
