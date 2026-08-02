import { useMemo } from "react";

export default function usePagination(
  data = [],
  currentPage = 1,
  perPage = 16,
) {
  const totalPages = Math.max(1, Math.ceil(data.length / perPage));

  const page = Math.min(Math.max(currentPage, 1), totalPages);

  const displayedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page, perPage]);

  return {
    displayedData,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
