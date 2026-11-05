import Link from "next/link";
import {
  LayoutGrid,
  ShoppingBag,
  ChartNoAxesCombined,
  ArrowRight,
  ChefHat,
} from "lucide-react";
import DashboardOverview from "@/components/dashboardComponents/DashboardOverview";
import DashboardInsights from "@/components/dashboardComponents/DashboardInsights";
import DashboardAnalytics from "@/components/dashboardComponents/DashboardAnalytics";
import DashboardOrders from "@/components/dashboardComponents/DashboardOrders";
// import MenuCatalogHeader from "@/components/dashboardComponents/MenuCatalogHeader";
const quickActions = [
  {
    title: "Manage Menu",
    description: "Add, edit or remove dishes.",
    href: "/dashboard/menu",
    icon: LayoutGrid,
    soon: false,
  },
  {
    title: "Live Orders",
    description: "Track kitchen progress.",
    href: "/dashboard/live-orders",
    icon: ShoppingBag,
    soon: true,
  },
  {
    title: "Analytics",
    description: "Review sales trends.",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
    soon: true,
  },
];

export default function Dashboard() {
  return (
    <main className="space-y-6">
      <hr className="mx-auto mt-6 w-[85%] border-[#EDE7DD]/70" />
      <DashboardOverview />

      <section className="space-y-6 px-6 pb-12 lg:px-10">
        {/* Welcome hero — full width so it keeps its natural height */}
        <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all duration-300 hover:border-orange/20 hover:shadow-[0_20px_36px_-24px_rgba(36,23,8,0.45)] lg:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 animate-float rounded-full bg-orange/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-28 h-40 w-40 animate-float-delayed rounded-full bg-gold/15 blur-2xl"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-orange-deep">
                <ChefHat size={13} strokeWidth={2.5} />
                Dashboard
              </span>

              <h1 className="mt-3 font-display text-2xl font-black tracking-tight text-ink lg:text-3xl">
                Welcome back, <span className="italic text-orange">Chef</span>
              </h1>

              <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-brown">
                Here is a quick look at what is happening at Burger House
                today.
              </p>
            </div>

            <Link
              href="/dashboard/menu"
              className="group inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] sm:self-auto"
            >
              Manage Menu
              <ArrowRight
                size={15}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Quick actions — compact 3-card row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map(
            ({ title, description, href, icon: Icon, soon }) => {
              const inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={17} strokeWidth={2} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-orange-deep">
                        {title}
                      </span>

                      {soon && (
                        <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[9px] font-bold text-brown/60">
                          Soon
                        </span>
                      )}
                    </span>

                    <span className="mt-0.5 block truncate text-[11px] text-brown/60">
                      {description}
                    </span>
                  </span>

                  {!soon && (
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="shrink-0 text-orange transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </>
              );

              const className =
                "group flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3.5 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/25 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]";

              return soon ? (
                <div key={title} className={className}>
                  {inner}
                </div>
              ) : (
                <Link key={title} href={href} className={className}>
                  {inner}
                </Link>
              );
            }
          )}
        </div>

        {/* Sample analytics + orders — placeholders until real data is wired */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DashboardAnalytics />
          </div>
          <div className="lg:col-span-2">
            <DashboardOrders />
          </div>
        </div>

        {/* Real-data insights — categories, price snapshot, menu preview */}
        <DashboardInsights />
      </section>
    </main>
  );
}
