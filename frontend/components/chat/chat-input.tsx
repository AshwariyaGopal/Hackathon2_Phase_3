"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="relative flex items-end gap-2 bg-muted/20 p-2 rounded-[30px] border border-primary/10 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300 shadow-inner">
      <Textarea
        ref={textareaRef}
        placeholder="Type a message..."
        aria-label="Chat message"
        className="flex-1 min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-4 shadow-none font-medium placeholder:text-muted-foreground/50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Button
        size="icon"
        className="shrink-0 h-10 w-10 rounded-full shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition-all duration-200"
        onClick={handleSend}
        disabled={!input.trim() || disabled}
      >
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
}
