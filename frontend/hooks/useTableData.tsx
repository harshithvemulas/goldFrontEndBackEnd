import { useSWR } from "@/hooks/useSWR";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SWRConfiguration } from "swr";

type TTableMeta = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: 1;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
};

export function useTableData(url: string, options?: SWRConfiguration) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Separate URL path and query string
  const [baseUrl, queryString] = url.split("?");

  // Initialize URLSearchParams with the existing query string if present
  const q = new URLSearchParams(queryString);

  // Set default values for 'page' and 'limit' if not present
  if (!q.has("page")) q.set("page", "1");
  if (!q.has("limit")) q.set("limit", "10");

  // Combine the base URL with the updated query parameters
  const urlString = `${baseUrl}?${q.toString()}`;

  const { data, error, isLoading, mutate, ...others } = useSWR(
    urlString,
    options,
  );

  // handle filter

  const filter = (key: string, value: string, cb?: () => void) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value.toString());
    else sp.delete(key);
    router.replace(`${pathname}?${sp.toString()}`);
    cb?.();
  };

  return {
    refresh: () => mutate(data),
    data: data?.data?.data ?? [],
    meta: data?.data?.meta as TTableMeta,
    filter,
    isLoading,
    error,
    ...others,
  };
}
