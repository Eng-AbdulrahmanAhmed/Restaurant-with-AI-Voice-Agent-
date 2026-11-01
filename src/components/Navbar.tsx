import Link from 'next/link'
import Image from "next/image";
import burgerLogo from "@/assets/logo-no-background.png"
import AuthButtons from "@/components/AuthButtons";
export default function Navbar(){
    return(
        <header className="grid grid-cols-3 items-center h-[72px] px-6 lg:px-10">
            <div className="image-container flex">
                <Link href={"/"} className='flex items-center ' >
                    <Image alt={"Burger Image"} className=' mr-2' src={burgerLogo} width={50} height={50}/>
                     <span className='text-lg font-semibold text-charcoal'>Burger<span className='text-orange'>House.</span></span>
                </Link>
            </div>
            <nav className="flex justify-center">
                <ul className="navlinks-list flex items-center gap-6 text-charcoal">
                    {[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Menu', href: '/menu' },
                    { label: 'dashboard', href: '/dashboard' },
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
            <AuthButtons/>
        </header>
    )
}