export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 bg-zinc-900 rounded-md" />
      <div className="space-y-4">
        <div className="h-10 w-full bg-zinc-900 rounded-md" />
        <div className="h-96 w-full bg-zinc-900 rounded-xl" />
      </div>
    </div>
  );
}
