export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="animate-pulse space-y-8"
    >
      <div className="space-y-3">
        <div className="h-3 w-32 bg-[#132024]" />
        <div className="h-9 w-64 bg-[#132024]" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 border border-[#D4A359]/20 bg-[#132024]"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 border border-[#D4A359]/20 bg-[#132024]" />
        <div className="h-64 border border-[#D4A359]/20 bg-[#132024]" />
      </div>
    </div>
  );
}
