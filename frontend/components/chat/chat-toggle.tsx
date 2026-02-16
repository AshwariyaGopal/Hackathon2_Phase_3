"use client"

import { MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ChatToggle() {
  const pathname = usePathname()

  // Don't show on the chat page itself
  if (pathname === "/chat") return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/chat">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-2xl hover:scale-110 transition-transform duration-200 bg-primary group"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6 group-hover:opacity-0 transition-opacity" />
            <Sparkles className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
          </div>
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </Link>
    </div>
  )
}
