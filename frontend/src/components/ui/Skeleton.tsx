'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-shimmer rounded-lg bg-surface-200', className)} />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 border-l-4 border-l-surface-200 shadow-sm p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatusSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-4 bg-white border border-surface-200">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-8 w-10" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      {/* Summary cards */}
      <div className="mb-8">
        <StatusSummarySkeleton />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-[180px] rounded-xl" />
      </div>

      {/* Task list */}
      <TaskListSkeleton count={5} />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
