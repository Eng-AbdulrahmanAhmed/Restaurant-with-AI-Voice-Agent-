import DashboardOverview from "@/components/dashboardComponents/DashboardOverview";
// STYLE MOD — new catalog section import (heading + search + pills + items grid).
// (undo: replace this import with the commented original below)
import MenuCatalog from "@/components/dashboardComponents/MenuCatalog";
import Link from "next/link";
// import MenuCatalogHeader from "@/components/dashboardComponents/MenuCatalogHeader";
export default function Dashboard() {
  return (

    <main className="space-y-8">
        <hr className="mx-auto w-[85%] border-[#EDE7DD]/70 mt-8" />
      <DashboardOverview />
      <MenuCatalog />
    </main>
  );
}