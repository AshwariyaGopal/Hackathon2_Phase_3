export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: Priority;
  category: string;
  due_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "error";
}

export interface ClientConversation {
  conversation_id: number | null;
  messages: ClientMessage[];
  isLoading: boolean;
}
