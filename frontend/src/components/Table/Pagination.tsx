// Pagination.tsx

import React from 'react';

type PaginationProps = {
  page: number;
  item_counts: {
    per_page: number;
    total: number;
    total_pages: number;
  };
  handlePrevious: () => void;
  handleNext: () => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, item_counts, handlePrevious, handleNext }) => {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{page * item_counts.per_page - 10}</span> to <span className="font-medium">{Math.min(page * item_counts.per_page, item_counts.total)}</span> of{' '}
          <span className="font-medium">{item_counts.total}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={handlePrevious}
          className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 ${page === 1 && "opacity-50 cursor-not-allowed"}`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 ${item_counts.total_pages === page && "opacity-50 cursor-not-allowed"}`}
          disabled={item_counts.total_pages === page}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;