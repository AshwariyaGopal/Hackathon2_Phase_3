"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "@/components/layout/user-nav"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Logo } from "@/components/shared/logo"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/tasks" },
    { name: "AI Assistant", href: "/chat" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 items-center px-6 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-200 hover:bg-muted",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-8 w-px bg-border/60 mx-1" />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}
