import Navbar from "@/components/Navbar"
/* STYLE MOD (step 2 — landing) — new: reference Footer mounted below every
   (main) page. Footer.jsx + footerComponents/BurgerMark.tsx are new files
   copied from the reference. (undo: delete this import + the <Footer /> below) */
import Footer from "@/components/Footer"
export default function layout({children}:LayoutProps<"/">) {
    return(
        <>
            <Navbar />
            {children}
            {/* STYLE MOD (step 2 — landing) — footer renders after page content
                like the reference. (undo: delete this line) */}
            <Footer />
        </>
    )
}
