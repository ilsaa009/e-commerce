'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PaginationControls = ({ hasNextPage, hasPrevPage, totalEntries, currentPage, perPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = currentPage || Number(searchParams.get('page') ?? '1');
  const totalPages = Math.ceil(totalEntries / perPage);
  const rangeSize = 3; 

  let startPage = Math.max(page - Math.floor(rangeSize / 2), 1);
  let endPage = startPage + rangeSize - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - rangeSize + 1, 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const handlePageChange = (newPage) => {
    router.push(`/?page=${newPage}&per_page=${perPage}`);
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      <button
        className={`p-2 rounded-md text-white ${!hasPrevPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} transition-all`}
        disabled={!hasPrevPage}
        onClick={() => handlePageChange(page - 1)}
      >
        {'<'}
      </button>

      {page > rangeSize && (
        <button
          className="p-2 rounded-md text-blue-500 hover:bg-blue-100 transition-all"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      )}

      {page > rangeSize + 1 && <span className="text-gray-500">...</span>}

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          className={`p-2 rounded-md ${pageNum === page ? 'bg-blue-700 text-white' : 'text-blue-500 hover:bg-blue-100'} transition-all`}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {page < totalPages - rangeSize && <span className="text-gray-500">...</span>}

      {page < totalPages - rangeSize && (
        <button
          className="p-2 rounded-md text-blue-500 hover:bg-blue-100 transition-all"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      )}

      <button
        className={`p-2 rounded-md text-white ${!hasNextPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} transition-all`}
        disabled={!hasNextPage}
        onClick={() => handlePageChange(page + 1)}
      >
        {'>'}
      </button>
    </div>
  );
};

export default PaginationControls;
