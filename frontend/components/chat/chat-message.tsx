import { cn } from "@/lib/utils";
import { ClientMessage } from "@/lib/types";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ClientMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-3 sm:gap-4 mb-5",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 shadow-lg shadow-primary/5">
          <Bot className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] sm:max-w-[75%] rounded-[20px] px-4 py-3 sm:px-5 sm:py-3.5 text-sm shadow-xl transition-all relative group",
          isAssistant
            ? "bg-card text-foreground rounded-tl-none border border-primary/5"
            : "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed font-medium">
          {message.content}
        </div>
        
        <div
          className={cn(
            "flex items-center gap-1.5 text-[10px] mt-2 opacity-40 font-bold uppercase tracking-widest",
            isAssistant ? "text-muted-foreground" : "text-primary-foreground"
          )}
        >
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.status === "sending" && (
             <span className="flex items-center gap-1">
               <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
               Sending
             </span>
          )}
          {message.status === "error" && (
             <span className="text-destructive-foreground bg-destructive px-1.5 rounded-sm">
               Error
             </span>
          )}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border shadow-md">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
