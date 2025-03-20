import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProblems from "@/store/leetcode/hook";

interface PaginationProps {
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}) => {
  const { pageSize, problemCnt, problemList } = useProblems();

  return (
    <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-800/50">
      <p className="text-sm text-zinc-400">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, problemCnt)} of {problemCnt} problems
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select
          value={currentPage.toString()}
          onValueChange={(value) => goToPage(parseInt(value))}
        >
          <SelectTrigger className="w-[70px] bg-zinc-800/50 border-zinc-700/50">
            <SelectValue placeholder="Page..." />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {Array.from({ length: problemList.pageCount }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === problemList.pageCount}
          className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
