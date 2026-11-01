export default function Flame() {
  return (
    <div className="absolute -left-2 top-4 z-20 h-28 w-28 md:-left-6 md:h-32 md:w-32">
        {/* Rotating circular text */}
        <svg
        viewBox="0 0 120 120"
        className="h-full w-full animate-spin-slow"
        aria-hidden="true"
        >
        <defs>
            <path
            id="badge-circle"
            d="M60 14a46 46 0 1 1 0 92 46 46 0 1 1 0-92"
            />
        </defs>

        <circle cx="60" cy="60" r="59" fill="#241708" />

        <text
            fill="#FAF3E2"
            fontSize="11.5"
            fontWeight="600"
            letterSpacing="2.5"
        >
            <textPath href="#badge-circle">
            FLAME-GRILLED · FRESH DAILY · SINCE 2012 ·
            </textPath>
        </text>
        </svg>

        {/* Flame container */}
        <div className="absolute inset-0 flex items-center justify-center">

        {/* Flame glow */}
        <div className="flame-glow absolute h-9 w-9 rounded-full bg-orange/40 blur-xl" />

        {/* Rising sparks */}
        <span className="flame-spark spark-one" />
        <span className="flame-spark spark-two" />
        <span className="flame-spark spark-three" />
        <span className="flame-spark spark-four" />

        {/* Main flame */}
        <svg
            viewBox="0 0 48 56"
            className="relative z-10 h-10 w-9 flame-body"
            aria-hidden="true"
        >
            <defs>
            <linearGradient id="flameOuter" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF9D32" />
                <stop offset="55%" stopColor="#F2690D" />
                <stop offset="100%" stopColor="#D15400" />
            </linearGradient>
            </defs>

            {/* Outer flame */}
            <path
            className="flame-outer"
            d="M24 2C22 12 8 18 6 32C3 45 11 54 24 54C38 54 46 44 42 31C39 20 30 15 29 7C27 13 25 16 23 19C25 12 25 7 24 2Z"
            fill="url(#flameOuter)"
            />

            {/* Inner yellow flame */}
            <path
            className="flame-inner"
            d="M24 27C21 33 16 37 17 43C18 49 22 51 26 50C32 49 35 43 32 37C30 33 26 30 24 27Z"
            fill="#FFD166"
            />

            {/* Hot core */}
            <path
            d="M25 40C22 43 22 47 25 48C28 48 29 44 25 40Z"
            fill="#FFF1C1"
            />
        </svg>
        </div>
    </div>
  );
}