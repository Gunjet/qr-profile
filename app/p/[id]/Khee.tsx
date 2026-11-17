// Running "алхан хээ" (meander) band drawn as a repeating SVG pattern.
export function Khee({ className = "" }: { className?: string }) {
  return (
    <svg className={className} height="14" width="100%" aria-hidden>
      <defs>
        <pattern id="khee" width="16" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 12.5H16M12 12.5V1.5H3.5V9H9V5H6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#khee)" />
    </svg>
  );
}
