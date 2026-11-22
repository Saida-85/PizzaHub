export default function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading menu"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-[#D4A359]/20 bg-[#132024]"
        >
          <div className="aspect-[4/3] bg-[#0B1315]" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 bg-[#0B1315]" />
            <div className="h-3 w-1/2 bg-[#0B1315]" />
            <div className="h-10 w-full bg-[#0B1315]" />
          </div>
        </div>
      ))}
    </div>
  );
}
