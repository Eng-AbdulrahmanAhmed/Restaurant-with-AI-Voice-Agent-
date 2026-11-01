import DashboardOverview from "@/components/dashboardComponents/DashboardOverview";
// STYLE MOD — new catalog section import (heading + search + pills + items grid).
// (undo: replace this import with the commented original below)
import MenuCatalog from "@/components/dashboardComponents/MenuCatalog";
// import MenuCatalogHeader from "@/components/dashboardComponents/MenuCatalogHeader";
export default function Dashboard() {
  return (

    <main className="space-y-8">
        <hr className="mx-auto w-[85%] border-[#EDE7DD]/70 mt-8" />
      <DashboardOverview />

      {/* STYLE MOD — mounting the Menu Catalog section under the overview:
            badge "Menu Catalog Database" / h1 "Manage Our Menu Items" / the
            description line / search that really filters / category pills with
            our SVG icons / adapted item cards + pagination. Undo: delete this
            element + the new import above; nothing else on this page changed. */}
      <MenuCatalog />

   {/* Your existing menu items */}
    </main>
  );
}