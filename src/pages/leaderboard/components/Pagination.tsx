import React from "react";
import { Icon } from "@iconify/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | string)[] = [];

    pages.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 mb-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
          currentPage === 1 || loading
            ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
            : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
        }`}
      >
        <Icon icon="mingcute:left-line" className="w-4 h-4" />
        <span className="font-tiktok hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "string" ? (
              <span className="px-3 py-2 text-main-light-text/60 font-tiktok text-sm">
                {page}
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm min-w-[40px] transition-all duration-300 ${
                  currentPage === page
                    ? "bg-main-accent/15 border border-main-accent/50 text-main-accent shadow-main-accent/20 cursor-pointer"
                    : loading
                    ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
                    : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
                }`}
              >
                <span className="font-tiktok">{page}</span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
          currentPage === totalPages || loading
            ? "bg-white/[0.02] border border-white/[0.05] text-main-light-text/40 cursor-not-allowed"
            : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent cursor-pointer"
        }`}
      >
        <span className="font-tiktok hidden sm:inline">Next</span>
        <Icon icon="mingcute:right-line" className="w-4 h-4" />
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="ml-4 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-main-accent animate-pulse"></div>
          <span className="font-tiktok text-sm text-main-light-text/60">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
