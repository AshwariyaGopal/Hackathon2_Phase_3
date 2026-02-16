"use client"

import * as React from "react"
import { useTasks } from "@/hooks/use-tasks"
import { TaskList } from "@/components/tasks/task-list"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { EditTaskModal } from "@/components/tasks/edit-task-modal"
import { DeleteTaskModal } from "@/components/tasks/delete-task-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FilterX } from "lucide-react"
import { Task } from "@/lib/services/tasks"

import { setupNotifications, checkTaskReminders } from "@/lib/services/notifications"

interface TaskDashboardProps {
  initialTasks: Task[]
}

export function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const { tasks, isLoading, filters, setFilters, addTask, updateTask, deleteTask } = useTasks(initialTasks)
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = React.useState<string | null>(null)

  // Initialize notifications
  React.useEffect(() => {
    setupNotifications()
  }, [])

  // Check for reminders periodically
  React.useEffect(() => {
    if (tasks.length > 0) {
      checkTaskReminders(tasks)
    }
    const interval = setInterval(() => checkTaskReminders(tasks), 60000)
    return () => clearInterval(interval)
  }, [tasks])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as any })
  }

  const handlePriorityChange = (value: string) => {
    setFilters({ ...filters, priority: value === "all" ? undefined : value as any })
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      sort_by: "created_at",
      sort_order: "desc",
      search: "",
      priority: undefined
    })
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-8">
      {/* Top Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-lg">
            Your tasks, clearly organized in one place.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-all hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="h-px w-full bg-gray-100 mb-8" />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 rounded-xl"
            value={filters.search || ""}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority || "all"} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl text-gray-400 hover:text-gray-900"
            onClick={clearFilters}
            title="Clear filters"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onToggle={(id, completed) => updateTask(id, { is_completed: completed })}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(id) => setDeletingTaskId(id)}
          onCreate={() => setIsCreateModalOpen(true)}
        />
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onAdd={addTask}
      />

      <EditTaskModal
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onUpdate={updateTask}
      />

      <DeleteTaskModal
        open={!!deletingTaskId}
        onOpenChange={(open) => !open && setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) {
            deleteTask(deletingTaskId)
            setDeletingTaskId(null)
          }
        }}
      />
    </div>
  )
}