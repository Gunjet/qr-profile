export default function Loading() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto max-w-md">
        <div className="hero-bg flex flex-col items-center rounded-b-[2.25rem] px-6 pt-20 pb-24">
          <div className="size-[140px] animate-pulse rounded-full bg-white/15" />
          <div className="mt-6 h-7 w-56 animate-pulse rounded-lg bg-white/15" />
          <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/10" />
        </div>
        <div className="space-y-4 px-4 pt-10">
          <div className="h-40 animate-pulse rounded-3xl bg-white" />
          <div className="h-56 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    </main>
  );
}
