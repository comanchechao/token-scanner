import React from "react";
import { Icon } from "@iconify/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
          ${
            currentPage <= 1
              ? "border-subtle bg-surface text-main-light-text/30 cursor-not-allowed"
              : "border-subtle bg-surface text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
          }
        `}
      >
        <Icon icon="material-symbols:chevron-left" width={16} height={16} />
      </button>

      <div className="flex items-center gap-2 px-3">
        <span className="font-mono text-sm text-main-text">
          {currentPage}
        </span>
        <span className="font-mono text-sm text-main-light-text/40">
          /
        </span>
        <span className="font-mono text-sm text-main-light-text/60">
          {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
          ${
            currentPage >= totalPages
              ? "border-subtle bg-surface text-main-light-text/30 cursor-not-allowed"
              : "border-subtle bg-surface text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
          }
        `}
      >
        <Icon icon="material-symbols:chevron-right" width={16} height={16} />
      </button>
    </div>
  );
};

export default Pagination;
