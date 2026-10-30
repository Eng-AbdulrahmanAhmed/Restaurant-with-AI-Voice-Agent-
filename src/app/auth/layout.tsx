import Link from "next/link"
import Image from "next/image"
import pattern from "@/assets/food-doodle-pattern.svg"
import burgerLogo from "@/assets/logo-no-background.png"
import { ArrowLeft, House } from "lucide-react"
export default function layout({children}:LayoutProps<"/">){
    const bgUrl = typeof pattern === "string" ? pattern : pattern.src;
    return(
        <section className="h-screen w-full flex">
            {/* STYLE MOD — wider padding so content clears ~64px like the reference
                (undo: restore px-8 py-4) */}
            <div className="w-1/2 bg-[#fcf6ec] px-6 py-6 lg:px-16 flex flex-col ">
                <div className="flex items-center justify-between">
                    <Link href={"/"} className='flex items-center ' >
                        <Image alt={"Burger Image"} className=' mr-2' src={burgerLogo} width={50} height={50}/>
                        {/* STYLE MOD — wordmark coloured like the reference: charcoal
                            "Burger" + orange "House." (undo: revert span to "Burger House") */}
                        <span className='text-lg font-semibold text-charcoal'>Burger<span className='text-orange'>House.</span></span>
                    </Link>
                    {/* STYLE MOD — same animated underline as Home/About/Menu in the navbar,
                        but in muted grey on hover so the state matches the link's own colour.
                        (undo: delete the after:* classes, and restore hover:underline) */}
                    <Link href={"/"} className='flex items-center mr-8 text-muted relative
                                                 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                                                 after:bg-muted after:transition-all after:duration-300
                                                 hover:after:w-full'>
                        <span className="mr-2"><ArrowLeft size={18} /></span> back to home
                    </Link>
                </div>
            {/* STYLE MOD — my-auto instead of items-centre so short screens scroll
                naturally instead of clipping the form at both ends (undo: add back
                items-center and drop my-auto from the page root) */}
            <div className="flex flex-1 justify-center">
                {children}
            </div>
            </div>
            <div className="w-1/2  h-full bg-[length:350px_350px] bg-center bg-repeat"
            style={{ backgroundImage: `url("${bgUrl}")` }}>
            </div>
        </section>
    )
}