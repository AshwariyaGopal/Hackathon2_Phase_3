import { taskService, Task } from "@/lib/services/tasks"
import { TaskDashboard } from "@/components/tasks/task-dashboard"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

async function TaskLoader() {
  let tasks: Task[] = []
  try {
    tasks = await taskService.getAll()
  } catch {
    // If it fails (e.g. unauthorized), we pass empty tasks
    // redirect will happen in middleware or handle on client
  }
  
  return <TaskDashboard initialTasks={tasks} />
}

export default function TasksPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <TaskLoader />
    </Suspense>
  )
}
