/** Fallback for pages that read cookies / the database, so navigations stay instant. */
export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Ачаалж байна">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200/70" />
      <div className="h-40 animate-pulse rounded-2xl bg-white" />
      <div className="h-64 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}
