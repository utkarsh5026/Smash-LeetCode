import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import useProblems from "@/store/leetcode/hook";
import type { ProblemFilters, ProblemBasic } from "@/store/leetcode/type";
import { parseLeetcodeQuestionName } from "../utils";
import { useNavigate } from "react-router-dom";
import ProblemCard from "./ProblemCard";
import ProblemsHeader from "./ProblemsHeader";
import Pagination from "./Pagination";

const Problems: React.FC = () => {
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
  const navigate = useNavigate();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (loading || !problemList) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-zinc-400 animate-pulse text-lg">
            Loading coding challenges...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4 font-cascadia-code"
    >
      {/* Header Section with blurred background */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg pb-6 rounded-xl border border-zinc-800/50">
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

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problemList.problems.map((problem, index) => (
          <div key={`${problem.name}-${index}`} className="cursor-pointer">
            <ProblemCard
              problem={problem}
              index={index}
              currentPage={currentPage}
              pageSize={pageSize}
              isHovered={hoveredProblem === problem.name}
            />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        goToNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, problemList.pageCount))
        }
        goToPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        goToPage={(page) => setCurrentPage(page)}
      />
    </motion.div>
  );
};

export default Problems;
