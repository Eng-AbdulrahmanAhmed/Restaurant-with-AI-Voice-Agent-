import { ReactNode } from "react";
import Navbar from "@/components/dashboardComponents/DashboardNavbar";
export default function MenuLayout({children}:LayoutProps<"/">) {
    return(
        <>  
            <Navbar />
            {children}
        </>
    )
}