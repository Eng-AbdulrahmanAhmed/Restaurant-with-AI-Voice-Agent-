import {
  ChevronRight, 
  ChevronLeft ,

} from "lucide-react"
import PaginationButton from "./paginationButton"

export default function PaginationControls({
	page ,totalPages
}:{
	page:number ,totalPages:number
}){
	return(
		<>
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
					<PaginationButton
						key={p}
						page={p}
						isActive={p === page}
					>
					{p}
					</PaginationButton>
				))}			
				</div> 
			)}
    </>
	)
}