import { Skeleton } from "@/components/ui/skeleton";

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}
        >
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className={`flex flex-col gap-2 max-w-[70%] ${i % 2 === 0 ? "items-end" : "items-start"}`}>
            <Skeleton className="h-12 w-[200px] rounded-2xl" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
