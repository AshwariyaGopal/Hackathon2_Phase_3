"use client"

import { TaskCard } from "./task-card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "./empty-state"
import { Task } from "@/lib/services/tasks"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onToggle: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

export function TaskList({ tasks, isLoading, onToggle, onEdit, onDelete, onCreate }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-b border-gray-100 last:border-0">
             <div className="flex items-center gap-4">
               <Skeleton className="h-5 w-5 rounded-sm" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-4 w-1/3" />
                 <Skeleton className="h-3 w-1/4" />
               </div>
             </div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return <EmptyState onCreate={onCreate} />
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
