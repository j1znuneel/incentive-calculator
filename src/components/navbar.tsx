"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="px-4 md:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-zinc-800 bg-zinc-950 w-64">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent onItemClick={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>



          {session?.user?.role === "ADMIN" && pathname.startsWith("/admin") && (
            <>            
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-white flex items-center justify-center">
                <div className="h-3 w-3 bg-black rounded-sm" />
              </div>
              <span className="font-bold tracking-tight text-white hidden sm:inline-block">Quota</span>
            </Link>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                <span className="h-4 w-px bg-zinc-800 hidden sm:inline-block" />
                <span className="text-zinc-300">Administration</span>
              </div>
            </>

          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
 
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex flex-col items-end xs:flex">
              <span className="text-xs font-semibold text-white whitespace-nowrap">
                {session?.user?.name?.split(' ')[0]}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {session?.user?.role === "ADMIN" ? "Admin" : "Sales"}
              </span>
            </div>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-zinc-400 hover:text-white px-2 md:px-3"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
