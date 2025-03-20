import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Code2,
  ChevronRight,
  Activity,
  Tags,
  ChevronLeft,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useProblems from "@/store/leetcode/hook";
import type { ProblemFilters, ProblemBasic } from "@/store/leetcode/type";
import { parseLeetcodeQuestionName } from "../utils";
import { useNavigate } from "react-router-dom";
import ProblemCard from "./ProblemCard";

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

  const handleNavigateToProblem = (problem: ProblemBasic) => {
    navigate(`/leetcode/${parseLeetcodeQuestionName(problem.name)}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
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
      className="space-y-6 p-4"
    >
      {/* Header Section with blurred background */}
      <motion.div
        variants={itemVariants}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg pb-6 rounded-xl border border-zinc-800/50"
      >
        <div className="relative overflow-hidden rounded-xl">
          {/* Blur effects */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl opacity-20 animate-pulse" />

          <div className="relative z-10 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      LeetCode Problems
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {problemCnt} problems available
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="bg-zinc-900/80 backdrop-blur-sm"
                >
                  <Activity className="w-4 h-4 mr-1 text-primary" />
                  <span>
                    Success Rate:{" "}
                    {problemList?.problems.reduce(
                      (acc, p) => acc + parseFloat(p.acceptance_rate),
                      0
                    ) / problemList?.problems.length}
                    %
                  </span>
                </Badge>
              </div>

              {/* Filters Section */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800/50 focus-visible:ring-primary/40"
                  />
                </div>

                {/* Difficulty Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800"
                    >
                      <Filter className="h-4 w-4 text-primary/80" />
                      <span>
                        {difficulties.length
                          ? `${difficulties.length} Difficulties`
                          : "All Difficulties"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                    {["Easy", "Medium", "Hard"].map((diff) => (
                      <DropdownMenuCheckboxItem
                        key={diff}
                        checked={difficulties.includes(diff)}
                        onCheckedChange={(checked) =>
                          handleDifficultyChange(diff, checked)
                        }
                        className={
                          diff === "Easy"
                            ? "text-green-400"
                            : diff === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {diff}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tags Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800"
                    >
                      <Tags className="h-4 w-4 text-primary/80" />
                      <span>Tags ({selectedTags.length})</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-zinc-800 max-h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          setSelectedTags((prev) =>
                            checked
                              ? [...prev, tag]
                              : prev.filter((t) => t !== tag)
                          );
                        }}
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Selection */}
                <Select
                  value={`${sortConfig.key ?? "none"}-${sortConfig.direction}`}
                  onValueChange={(value) => {
                    const [key, direction] = value.split("-") as [
                      string,
                      "asc" | "desc"
                    ];
                    setSortConfig({
                      key: key === "none" ? null : key,
                      direction,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-800/50">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="none-asc">No sorting</SelectItem>
                    <SelectItem value="acceptance_rate-asc">
                      Success Rate (Low to High)
                    </SelectItem>
                    <SelectItem value="acceptance_rate-desc">
                      Success Rate (High to Low)
                    </SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <Search className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problems Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {problemList.problems.map((problem, index) => (
            <div
              key={`${problem.name}-${index}`}
              onClick={() => handleNavigateToProblem(problem)}
              onMouseEnter={() => setHoveredProblem(problem.name)}
              onMouseLeave={() => setHoveredProblem(null)}
              className="cursor-pointer"
            >
              <ProblemCard
                problem={problem}
                index={index}
                currentPage={currentPage}
                pageSize={pageSize}
                isHovered={hoveredProblem === problem.name}
              />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-800/50"
      >
        <p className="text-sm text-zinc-400">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, problemCnt)} of {problemCnt}{" "}
          problems
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value))}
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
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(problemList.pageCount, prev + 1)
              )
            }
            disabled={currentPage === problemList.pageCount}
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Problems;
