// src/components/restaurant/RestaurantSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardFooter } from '@/components/ui/card';

export function RestaurantSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Restaurant Header Skeleton */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Menu Categories Skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <Skeleton className="h-6 w-48" />
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid gap-4">
            {[...Array(4)].map((_, j) => (
              <Card key={j} className="overflow-hidden border-gray-100">
                <div className="flex h-full">
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0" />
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <CardFooter className="p-0 pt-3 flex justify-between items-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}