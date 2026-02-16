import { Button } from "@/components/ui/button"
import { CheckCircle, Plus } from "lucide-react"

interface EmptyStateProps {
  onCreate: () => void
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500 min-h-[400px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-6">
        <CheckCircle className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">No tasks yet</h3>
      <p className="mt-2 mb-8 text-gray-500 max-w-sm text-sm">
        You&apos;re all caught up! Add your first task to get started with your day.
      </p>
      <Button onClick={onCreate} className="rounded-full bg-gray-900 text-white shadow-md hover:bg-gray-800">
        <Plus className="mr-2 h-4 w-4" /> Create Task
      </Button>
    </div>
  )
}