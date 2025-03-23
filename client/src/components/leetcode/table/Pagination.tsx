import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProblems from "@/store/leetcode/hook";

interface SleekPaginationProps {
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

const SleekPagination: React.FC<SleekPaginationProps> = ({
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}) => {
  const { pageSize, problemCnt, problemList } = useProblems();

  // Generate array of visible page numbers
  const getPageNumbers = () => {
    const totalPages = problemList.pageCount;
    const visiblePages = [];

    // Always show first page
    if (totalPages >= 1) visiblePages.push(1);

    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 2);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 2);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) visiblePages.push("...");

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      visiblePages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) visiblePages.push("...");

    // Always show last page if it exists and isn't already included
    if (totalPages > 1) visiblePages.push(totalPages);

    return visiblePages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-card/10 backdrop-blur-md rounded-xl border border-zinc-800/30 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm text-zinc-400">
          Showing{" "}
          <span className="text-white font-medium">
            {(currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="text-white font-medium">
            {Math.min(currentPage * pageSize, problemCnt)}
          </span>{" "}
          of <span className="text-white font-medium">{problemCnt}</span>{" "}
          problems
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="w-8 text-center text-zinc-500"
              >
                ...
              </span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => typeof page === "number" && goToPage(page)}
                className={`h-8 w-8 p-0 rounded-md ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === problemList.pageCount}
            className="h-8 w-8 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SleekPagination;
