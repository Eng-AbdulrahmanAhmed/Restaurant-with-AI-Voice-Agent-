"use client"
import {
  Utensils,
  TrendingUp,
  PackageX,
  Banknote,
} from "lucide-react";
import { useState , useEffect} from "react"
import { getProducts } from "@/services/productService";

export default function DashboardOverview() {
  
const [totalProducts, setTotalProducts] = useState(0);
//getting the total number of menu items from the productService.ts file
useEffect(() => {
  async function fetchTotalProductCount(){
    try{
      const {totalCount} = await getProducts();
      setTotalProducts(totalCount);
    }
    catch (error){
      console.error("Error fetching total product count:", error);
    }
  }
  fetchTotalProductCount();
} , [])


const stats = [
  {
    title: "Today's Sales",
    value: "$842",
    detail: "Sales today",
    icon: Banknote,
    iconStyle: "bg-orange/10 text-orange",
  },
  {
    title: "Total Menu Items",
    value: totalProducts.toString(),
    detail: "Across all categories",
    icon: Utensils,
    iconStyle: "bg-gold/15 text-gold",
  },
  {
    title: "Most Popular",
    value: "Classic Smash",
    detail: "128 orders today",
    icon: TrendingUp,
    iconStyle: "bg-lettuce/10 text-lettuce",
  },
  {
    title: "Out of Stock",
    value: "03",
    detail: "Items unavailable",
    icon: PackageX,
    iconStyle: "bg-tomato/10 text-tomato",
  },
];

  return (
    <section className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group flex w-full max-w-[230px] items-center gap-3 rounded-2xl border border-ink/10 bg-white px-3.5 py-3 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-22px_rgba(36,23,8,0.45)] sm:w-[230px]"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}
            >
              <Icon size={19} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-brown/70 transition-colors duration-200 group-hover:text-orange-deep">
                {stat.title}
              </p>

              <h3 className="mt-0.5 truncate font-display text-lg font-bold text-ink transition-colors duration-200 group-hover:text-orange">
                {stat.value}
              </h3>

              <p className="mt-0.5 truncate text-[11px] text-brown/50">
                {stat.detail}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
