import { apiClient } from "../api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  due_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TaskFilters {
  status?: "all" | "pending" | "completed";
  priority?: "low" | "medium" | "high";
  category?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const taskService = {
  getAll: (filters: TaskFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const query = params.toString();
    return apiClient<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  },
  
  create: async (data: Partial<Task>) => {
    try {
      return await apiClient<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Task creation failed:", error);
      throw error;
    }
  },
    
  update: (id: string, data: Partial<Task>) => 
    apiClient<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) => 
    apiClient(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
