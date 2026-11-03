import { ReactNode } from "react";
import Navbar from "@/components/dashboardComponents/DashboardNavbar";
import AddItemProvider from "@/components/dashboardComponents/AddItemContext";

export default function MenuLayout({ children }: { children: ReactNode }) {
    return (
        <AddItemProvider>
            <Navbar />
            {children}
        </AddItemProvider>
    );
}