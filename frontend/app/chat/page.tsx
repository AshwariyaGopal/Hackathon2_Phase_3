"use client";

import { useChat } from "@/hooks/use-chat";
import { useSession } from "@/lib/auth";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { EmptyChatState } from "@/components/chat/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Suspense } from "react";

function ChatContent() {
  const { messages, isLoading, sendMessage, clearChat, conversation_id } = useChat();

  return (
    <div className="flex-1 flex flex-col items-center w-full px-4 py-2 md:py-4 overflow-hidden bg-background">
      <div className="w-full max-w-4xl flex flex-col gap-4 h-[95vh] max-h-[95vh] relative">
        <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-primary/5 rounded-[24px] bg-card/50 backdrop-blur-sm relative z-10">
          <div className="px-8 py-6 border-b bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <h1 className="font-bold text-xl tracking-tight text-foreground">AI Assistant</h1>
              {conversation_id && (
                <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-primary/5">
                  Session: {conversation_id}
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
              onClick={clearChat}
              title="Clear Conversation"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {messages.length === 0 ? (
              <EmptyChatState />
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
          </div>

          <div className="px-8 py-6 border-t bg-background/50 backdrop-blur-md shrink-0">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </Card>
        
        <div className="flex items-center justify-center gap-2 px-4 opacity-60">
          <div className="w-1 h-1 bg-primary rounded-full" />
          <p className="text-[10px] text-center font-bold uppercase tracking-[0.2em]">
            Secured by TaskZen AI • Automatic Cloud Sync
          </p>
          <div className="w-1 h-1 bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}