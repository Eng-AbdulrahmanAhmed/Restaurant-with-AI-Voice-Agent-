"use client";

import { ChevronsRight, ChevronsLeft } from "lucide-react";
import PaginationButton from "./paginationButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      
		{currentPage !== 1 && (
			<PaginationButton page={1}>{<ChevronsLeft size={14} />}</PaginationButton>
		)}

		{currentPage !== 1 && (
			<PaginationButton page={currentPage-1}>{currentPage-1}</PaginationButton>
		)}

      	<PaginationButton page={currentPage} isActive={true}>{currentPage}</PaginationButton>

		{currentPage !== totalPages && (
			<PaginationButton page={currentPage+1}>{currentPage + 1}</PaginationButton>
		)}
		{currentPage !== totalPages && (
			<PaginationButton page={totalPages}>{<ChevronsRight size={14}/>}</PaginationButton>
		)}
	  
    </div>
  );
}
