import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
}

export function SectionSkeleton({ height = 'h-64' }: SkeletonProps) {
  return (
    <div className={`w-full ${height} bg-gray-100 animate-pulse rounded-sm`} aria-hidden="true" />
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-2 space-y-3">
          <div className="aspect-square bg-gray-200 rounded-md" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
