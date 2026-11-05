import {getQueryParams} from '@/lib/helpingFunctions/utils'
import ProductsBrowser from "@/components/ProductsBrowser";
export default async function Page({searchParams}:{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}){
	const {page} = getQueryParams(await searchParams)
	return(
		<ProductsBrowser page={page}/>
	)
}