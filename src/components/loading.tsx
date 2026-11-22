import MenuGridSkeleton from "@/components/MenuGridSkeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="h-24 max-w-md animate-pulse bg-[#132024]" />
      <div className="mt-10">
        <MenuGridSkeleton />
      </div>
    </section>
  );
}
