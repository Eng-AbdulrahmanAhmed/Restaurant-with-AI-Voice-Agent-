import DashboardOverview from "@/components/dashboardComponents/DashboardOverview";
import MenuCatalog from "@/components/dashboardComponents/MenuCatalog";
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