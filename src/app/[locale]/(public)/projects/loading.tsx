import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-12 md:py-16 min-h-screen">
      {/* Header Skeleton */}
      <div className="text-center mb-12 md:mb-16 space-y-4">
        <Skeleton className="h-12 md:h-16 w-3/4 max-w-lg mx-auto bg-muted/50" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto bg-muted/50" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 overflow-hidden h-full flex flex-col bg-card">
             <Skeleton className="aspect-[16/10] w-full bg-muted/60" />
             <div className="p-5 space-y-3 flex-1">
               <Skeleton className="h-6 w-3/4 bg-muted/60" />
               <Skeleton className="h-4 w-1/2 bg-muted/60" />
               <Skeleton className="h-12 w-full mt-2 bg-muted/40" />
               <div className="flex gap-2 mt-4">
                 <Skeleton className="h-5 w-16 bg-muted/40" />
                 <Skeleton className="h-5 w-16 bg-muted/40" />
                 <Skeleton className="h-5 w-16 bg-muted/40" />
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
