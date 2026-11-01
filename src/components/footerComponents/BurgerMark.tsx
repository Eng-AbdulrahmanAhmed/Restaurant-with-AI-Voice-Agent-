export function BurgerMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M6 20c0-8 8-13 18-13s18 5 18 13H6z"
        fill="#F2690D"
      />
      <circle cx="17" cy="13" r="1.4" fill="#FAF3E2" />
      <circle cx="24" cy="11" r="1.4" fill="#FAF3E2" />
      <circle cx="31" cy="13" r="1.4" fill="#FAF3E2" />
      <path d="M7 25c3-3 5 3 8.5 0s5 3 8.5 0 5 3 8.5 0 5 3 8.5 0v3H7v-3z" fill="#5C8A3A" />
      <rect x="7" y="30" width="34" height="5" rx="2.5" fill="#E9A13B" />
      <path d="M7 38h34c0 3-6 5-17 5S7 41 7 38z" fill="#F2690D" />
    </svg>
  );
}