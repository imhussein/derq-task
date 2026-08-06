"use client";

const DEFAULT_HEIGHTS = [100, 75, 90, 55, 68];

type ChartLoadingSkeletonProps = {
  heights?: number[];
};

export function ChartLoadingSkeleton({
  heights = DEFAULT_HEIGHTS,
}: ChartLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading chart data"
      className="flex h-72 items-end justify-around gap-4 px-2 pb-8"
    >
      {heights.map((height, index) => (
        <div
          key={index}
          className="flex-1 animate-pulse rounded-t-lg   bg-slate-200"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
