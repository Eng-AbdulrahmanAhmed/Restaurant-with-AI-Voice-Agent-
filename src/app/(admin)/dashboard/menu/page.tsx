import { getQueryParams } from '@/lib/helpingFunctions/utils';
import ProductsBrowser from "@/components/ProductsBrowser";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{
        search?: string;
        category?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const { page } = getQueryParams(params);
    const search = params.search || '';
    const category = params.category || '';
    return (
        <ProductsBrowser
            page={page}
            search={search}
            category={category}
        />
    );
}