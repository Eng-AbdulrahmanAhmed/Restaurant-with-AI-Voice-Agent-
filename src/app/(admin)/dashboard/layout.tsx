import { ReactNode } from "react";
import Navbar from "@/components/dashboardComponents/DashboardNavbar";
import AddItemProvider from "@/components/dashboardComponents/AddItemContext";

/*
 * STEP 3 — SERVER-SIDE DASHBOARD GUARD  (commented out — learning baseline)
 * --------------------------------------------------------------------------
 * Second gate beside the proxy: never render the admin area for a signed-out
 * or non-admin user. To restore: uncomment the import + the if-block below.
 *
 * import { redirect } from "next/navigation";
 * import { isAdmin } from "@/lib/auth";
 */

export default function DashboardLayout({ children }: { children: ReactNode }) {
    /*
    if (!(await isAdmin())) {
        redirect("/");
    }
    */

    return (
        <AddItemProvider>
            <Navbar />
            {children}
        </AddItemProvider>
    );
}
