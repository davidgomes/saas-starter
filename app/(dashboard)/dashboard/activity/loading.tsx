import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivityPageSkeleton() {
  return (
    <section className="flex-1 p-4 lg:p-8" aria-labelledby="loading-title">
      <h1 id="loading-title" className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[88px]">
          <div 
            className="animate-pulse space-y-4"
            role="status" 
            aria-label="Loading activity log"
          >
            <div className="flex items-center space-x-4">
              <div className="size-10 rounded-full bg-gray-200" aria-hidden="true"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded" aria-hidden="true"></div>
                <div className="h-3 w-24 bg-gray-200 rounded" aria-hidden="true"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="size-10 rounded-full bg-gray-200" aria-hidden="true"></div>
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 rounded" aria-hidden="true"></div>
                <div className="h-3 w-20 bg-gray-200 rounded" aria-hidden="true"></div>
              </div>
            </div>
          </div>
          <span className="sr-only">Loading activity log...</span>
        </CardContent>
      </Card>
    </section>
  );
}
