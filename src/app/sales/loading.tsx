export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 bg-zinc-900 rounded-md" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-40 w-full bg-zinc-900 rounded-xl" />
          <div className="h-96 w-full bg-zinc-900 rounded-xl" />
        </div>
        <div className="h-96 w-full bg-zinc-900 rounded-xl" />
      </div>
    </div>
  );
}
