import Navbar from "@/components/Navbar"

export default function layout({children}:LayoutProps<"/">) {
    return(
        <>
            <Navbar />
            {children}
        </>
    )
}