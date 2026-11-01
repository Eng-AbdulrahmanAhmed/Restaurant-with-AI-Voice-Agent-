
import {
  Utensils,
  TrendingUp,
  PackageX,
  Banknote,
} from "lucide-react";

const stats = [
  {
    title: "Today's Sales",
    value: "$842",
    detail: "Sales today",
    icon: Banknote,
    iconStyle: "bg-orange-100 text-[#F97316]",
  },
  {
    title: "Total Menu Items",
    value: "24",
    detail: "Across all categories",
    icon: Utensils,
    iconStyle: "bg-orange-100 text-[#F97316]",
  },
  {
    title: "Most Popular",
    value: "Classic Smash",
    detail: "128 orders today",
    icon: TrendingUp,
    iconStyle: "bg-green-100 text-green-600",
  },
  {
    title: "Out of Stock",
    value: "03",
    detail: "Items unavailable",
    icon: PackageX,
    iconStyle: "bg-red-100 text-red-500",
  },
];

export default function DashboardOverview() {
  return (
    <section className="flex flex-wrap items-center gap-3 justify-center mt-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="flex w-full max-w-[230px] items-center gap-3 rounded-xl border border-[#F0E8DE] bg-white px-3.5 py-3 shadow-sm transition-all hover:shadow-md sm:w-[230px]"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconStyle}`}
            >
              <Icon size={19} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-[#8B8178]">
                {stat.title}
              </p>

              <h3 className="mt-0.5 truncate text-lg font-bold text-[#292524]">
                {stat.value}
              </h3>

              <p className="mt-0.5 truncate text-[11px] text-[#A8A29E]">
                {stat.detail}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
