import { Code2, Activity, Filter, Tags, Search } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProblemList } from "@/store/leetcode/type";

interface ProblemsHeaderProps {
  problemCnt: number;
  problemList: ProblemList;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  difficulties: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortConfig: {
    key: string | null;
    direction: "asc" | "desc";
  };
  handleSearch: () => void;
  handleDifficultyChange: (difficulty: string, checked: boolean) => void;
  tags: string[];
  setSortConfig: (config: {
    key: string | null;
    direction: "asc" | "desc";
  }) => void;
}

const ProblemsHeader: React.FC<ProblemsHeaderProps> = ({
  problemCnt,
  problemList,
  searchQuery,
  setSearchQuery,
  difficulties,
  selectedTags,
  setSelectedTags,
  tags,
  handleSearch,
  handleDifficultyChange,
  sortConfig,
  setSortConfig,
}) => {
  return (
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
                        checked ? [...prev, tag] : prev.filter((t) => t !== tag)
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
  );
};

export default ProblemsHeader;
