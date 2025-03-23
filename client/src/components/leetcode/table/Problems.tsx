import React, { useCallback, useEffect, useState } from "react";
import useProblems from "@/store/leetcode/hook";
import type { ProblemFilters } from "@/store/leetcode/type";
import ProblemsHeader from "./ProblemsHeader";
import Pagination from "./Pagination";
import { Sparkles } from "lucide-react";
import SleekProblemRow from "./ProblemCard";
import "./style.css";

const SleekProblemsPage: React.FC = () => {
  const { fetchProblems, problemList, tags, pageSize, loading, problemCnt } =
    useProblems();
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProblem, setHoveredProblem] = useState<string | null>(null);

  const handleSearch = useCallback(() => {
    const filters: ProblemFilters = {
      page: currentPage,
      limit: pageSize,
      difficulty: difficulties,
      tags: selectedTags,
      acceptanceSort:
        sortConfig.key === "acceptance_rate" ? sortConfig.direction : "asc",
      firstQuery: true,
    };

    fetchProblems(filters);
  }, [
    currentPage,
    pageSize,
    difficulties,
    selectedTags,
    sortConfig,
    fetchProblems,
  ]);

  useEffect(() => {
    handleSearch();
  }, [currentPage, handleSearch]);

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setDifficulties((prev) =>
      checked ? [...prev, difficulty] : prev.filter((d) => d !== difficulty)
    );
  };

  if (loading || !problemList) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-zinc-400 text-lg">Loading coding challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-gradient">
      {/* Subtle background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto p-6 font-cascadia-code">
        {/* Header Section */}
        <div className="sticky top-4 z-40 bg-card/20 backdrop-blur-md rounded-xl border border-zinc-800/30 shadow-lg mb-8">
          <ProblemsHeader
            problemCnt={problemCnt}
            problemList={problemList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            difficulties={difficulties}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            handleSearch={handleSearch}
            handleDifficultyChange={handleDifficultyChange}
            tags={tags}
          />
        </div>

        {/* Table-style layout */}
        <div className="bg-card/10 backdrop-blur-md rounded-xl border border-zinc-800/30 shadow-lg overflow-hidden">
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/40">
            <div className="col-span-1 text-sm font-medium text-zinc-400">
              #
            </div>
            <div className="col-span-5 text-sm font-medium text-zinc-400">
              Problem
            </div>
            <div className="col-span-3 text-sm font-medium text-zinc-400">
              Tags
            </div>
            <div className="col-span-2 text-sm font-medium text-zinc-400 text-center">
              Difficulty
            </div>
            <div className="col-span-1 text-sm font-medium text-zinc-400 text-right">
              Rate
            </div>
          </div>

          {/* Problem Rows */}
          <div className="divide-y divide-zinc-800/30">
            {problemList.problems.map((problem, index) => (
              <SleekProblemRow
                key={`${problem.name}-${index}`}
                problem={problem}
                index={index}
                currentPage={currentPage}
                pageSize={pageSize}
                onHover={setHoveredProblem}
                isHovered={hoveredProblem === problem.name}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            goToNextPage={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, problemList.pageCount)
              )
            }
            goToPreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            goToPage={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default SleekProblemsPage;
