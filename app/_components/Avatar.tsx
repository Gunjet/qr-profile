export function Avatar({ name, photo, className = "" }: { name: string; photo: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt={name} className={`shrink-0 rounded-full object-cover ${className}`} />
  ) : (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-t-hero1 to-t-hero3 font-extrabold text-t-accent ${className}`}
    >
      {initials || "?"}
    </span>
  );
}
