export default function Features(){
    return(
        <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-5 border-y border-ink/10 px-6 py-7 sm:grid-cols-3 sm:gap-0">
        <div className="flex items-center justify-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 21c-4-3.5-7-7-7-10.5C5 6.5 8 4 12 4s7 2.5 7 6.5C19 14 16 17.5 12 21zm0-13v9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Fresh ingredients</span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:border-x sm:border-ink/10">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 3c1 2-.5 3 .5 5M8.5 4c.8 1.6-.4 2.5.4 4M15.5 4c-.8 1.6.4 2.5-.4 4M5 13a7 7 0 0 0 14 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Made to order</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 21c3.9 0 6.5-2.6 6.5-6 0-4.5-4-6.5-4-11-3 2-3.5 5-3 7.5C10.3 10.3 9 8.6 9 6c-2.1 2.1-3.5 4.6-3.5 7.5 0 4 2.7 7.5 6.5 7.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Big flavor</span>
        </div>
      </section>
    )
}