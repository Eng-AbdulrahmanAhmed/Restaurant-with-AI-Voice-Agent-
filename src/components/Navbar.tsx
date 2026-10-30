import Link from 'next/link'
import Image from "next/image";
import burgerLogo from "@/assets/logo-no-background.png"
export default function Navbar(){
    return(
        <header className="grid grid-cols-3 items-center h-[72px] px-6 lg:px-10">
            <div className="image-container flex">
                <Link href={"/"} className='flex items-center ' >
                    <Image alt={"Burger Image"} className=' mr-2' src={burgerLogo} width={50} height={50}/>
                    <span className='font-semibold text-charcoal'>Burger House</span>
                </Link>
            </div>
            <nav className="flex justify-center">
                <ul className="navlinks-list flex items-center gap-6 text-charcoal">
                    {[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Menu', href: '/menu' },
                    ].map(({ label, href }) => (
                    <li key={label}>
                        <Link
                        href={href}
                        className="relative cursor-pointer
                                    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                                    after:bg-orange after:transition-all after:duration-300
                                    hover:after:w-full"
                        >
                        {label}
                        </Link>
                    </li>
                    ))}
                </ul>
            </nav>
            <div className='flex items-center justify-end gap-6'>
                {/* STYLE MOD #6 — Register: animated underline (unchanged from your version) */}
                <Link
                href="/auth/register"
                className="relative text-charcoal cursor-pointer
                            after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                            after:bg-orange after:transition-all after:duration-300
                            hover:after:w-full">
                Register
                </Link>

                {/* STYLE MOD #5 — Sign in: flat orange button, no spinning border.
                    To restore the conic-border version, copy it back from
                    "PREVIOUS VERSION" at the bottom of this file. */}
            {/* STYLE MOD #5 restore — subtle glow, gentler than the old conic version.
                Rest = 0.3 alpha, hover = 0.55 (old one was 0.5 / 0.8).
                (undo: delete the two shadow-[...] classes and swap
                transition-[background-color,box-shadow] for transition-colors) */}
                    {/* STYLE MOD — hover is now the deepest step of the orange ramp
                        (orange -> burnt-orange -> deep-burnt) plus two premium touches:
                        a 2px lift on hover with the halo deepening into it, and press
                        feedback on :active so the button yields when clicked.
                        (undo: delete the hover:-translate-y-0.5, motion-reduce,
                        active: and focus-visible: classes, use hover:bg-burnt-orange,
                        and swap the transition back to
                        transition-[background-color,box-shadow]) */}
                    <Link
                        href="/auth/signin"
                        className="flex h-[40px] items-center justify-center rounded-[10px] bg-orange px-5
                                    text-sm font-semibold text-cream
                                    shadow-[0_0_12px_-4px_rgba(249,115,22,0.3)]
                                    hover:-translate-y-0.5 hover:bg-deep-burnt
                                    hover:shadow-[0_0_24px_-4px_rgba(194,65,12,0.45)]
                                    active:translate-y-0 active:shadow-[0_0_10px_-4px_rgba(154,52,18,0.3)]
                                    motion-reduce:hover:translate-y-0
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange
                                    transition-[background-color,box-shadow,transform] duration-300"
                        >
                        Sign in
                    </Link>
            </div>
        </header>
    )
}

/* ============ PREVIOUS VERSION — how to undo ============
   Every change in this file is marked "STYLE MOD". The complete old
   version of this component is preserved verbatim in:
       src/components/Navbar.previous.tsx.bak
   Copy its export block back over this file to undo. The file is a
   .bak, so Next.js never compiles it.
   ========================================================= */

