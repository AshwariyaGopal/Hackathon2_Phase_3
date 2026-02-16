"use client";

import { useEffect, useRef } from "react";
import { ClientMessage } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: ClientMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollRef} className="h-full px-4 py-5">
      <div 
        className="flex flex-col max-w-3xl mx-auto"
        role="log"
        aria-label="Chat history"
        aria-live="polite"
      >
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}
