"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { ClientMessage, ClientConversation } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const STORAGE_KEY = "todo-ai-conversation-id";

export function useChat() {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [conversation, setConversation] = useState<ClientConversation>({
    conversation_id: null,
    messages: [],
    isLoading: false,
  });

  // Load conversation ID from storage or query
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const initialId = queryId ? parseInt(queryId) : savedId ? parseInt(savedId) : null;
    
    if (initialId) {
      setConversation(prev => ({ ...prev, conversation_id: initialId }));
    }
  }, [queryId]);

  // Persist conversation ID
  useEffect(() => {
    if (conversation.conversation_id) {
      localStorage.setItem(STORAGE_KEY, conversation.conversation_id.toString());
    }
  }, [conversation.conversation_id]);

  // Fetch history when conversation_id or session changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!conversation.conversation_id) return;

      try {
        setConversation(prev => ({ ...prev, isLoading: true }));
        const history = await apiClient<any[]>(`/chat/history?conversation_id=${conversation.conversation_id}`);
        
        const mappedMessages: ClientMessage[] = history.map(msg => ({
          id: msg.id.toString(),
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: new Date(msg.created_at),
          status: "sent"
        }));

        setConversation(prev => ({
          ...prev,
          messages: mappedMessages,
          isLoading: false
        }));
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setConversation(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (conversation.conversation_id && conversation.messages.length === 0) {
      fetchHistory();
    }
  }, [conversation.conversation_id, conversation.messages.length, session?.user?.id]);

  const sendMessage = async (content: string) => {
    console.log("[Chat Hook] sendMessage called", { 
      hasSession: !!session, 
      isPending 
    });
    
    if (isPending) {
      toast.error("Please wait while we verify your session...");
      return;
    }

    if (!content.trim()) return;

    const userMessage: ClientMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      status: "sending",
    };

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      console.log("[Chat Hook] Calling API: /api/chat");
      const response = await apiClient<{
        conversation_id: number;
        response: string;
      }>("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: content,
          conversation_id: conversation.conversation_id,
        }),
      });

      const assistantMessage: ClientMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        status: "sent",
      };

      setConversation((prev) => ({
        ...prev,
        conversation_id: response.conversation_id,
        messages: [
          ...prev.messages.filter((m) => m.id !== userMessage.id),
          { ...userMessage, status: "sent" as const },
          assistantMessage,
        ],
      }));
    } catch (error) {
      console.error("[Chat Hook] API call failed:", error);
      setConversation((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === userMessage.id ? { ...m, status: "error" as const } : m
        ),
      }));
      toast.error(`Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setConversation((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversation({
      conversation_id: null,
      messages: [],
      isLoading: false,
    });
    toast.info("Conversation cleared");
  };

  return {
    ...conversation,
    sendMessage,
    clearChat,
  };
}
