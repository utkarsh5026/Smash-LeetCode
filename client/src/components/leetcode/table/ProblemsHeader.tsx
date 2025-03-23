import React from "react";
import { Code2, Filter, Tags, Search } from "lucide-react";
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

interface SleekHeaderProps {
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

const SleekHeader: React.FC<SleekHeaderProps> = ({
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
    <div className="p-5">
      <div className="flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 backdrop-blur-sm p-2 rounded-full">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">
                LeetCode Problems
              </h2>
              <p className="text-sm text-zinc-400">{problemCnt} challenges</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <div className="flex-1 min-w-[200px] relative">
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800/40 border-zinc-700/30 pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>

          {/* Difficulty Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-zinc-800/40 border-zinc-700/30"
              >
                <Filter className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-300">
                  {difficulties.length
                    ? `${difficulties.length} Difficulty`
                    : "Difficulty"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800/80 backdrop-blur-lg border-zinc-700/30">
              <DropdownMenuLabel className="text-zinc-400">
                Filter by Difficulty
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-700/50" />
              {["Easy", "Medium", "Hard"].map((diff) => (
                <DropdownMenuCheckboxItem
                  key={diff}
                  checked={difficulties.includes(diff)}
                  onCheckedChange={(checked) =>
                    handleDifficultyChange(diff, checked)
                  }
                  className={
                    diff === "Easy"
                      ? "text-green-300"
                      : diff === "Medium"
                      ? "text-yellow-300"
                      : "text-red-300"
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
                className="gap-2 bg-zinc-800/40 border-zinc-700/30"
              >
                <Tags className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-300">
                  {selectedTags.length ? `${selectedTags.length} Tags` : "Tags"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800/80 backdrop-blur-lg border-zinc-700/30 max-h-[300px] overflow-y-auto">
              <DropdownMenuLabel className="text-zinc-400">
                Select Tags
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-700/50" />
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
            <SelectTrigger className="w-[140px] bg-zinc-800/40 border-zinc-700/30">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800/80 backdrop-blur-lg border-zinc-700/30">
              <SelectItem value="none-asc">No sorting</SelectItem>
              <SelectItem value="acceptance_rate-asc">
                Success Rate (↑)
              </SelectItem>
              <SelectItem value="acceptance_rate-desc">
                Success Rate (↓)
              </SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="default"
            size="sm"
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Active filters display */}
        {(difficulties.length > 0 || selectedTags.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {difficulties.map((diff) => (
              <Badge
                key={diff}
                variant="outline"
                className={`
                  ${
                    diff === "Easy"
                      ? "bg-green-500/10 text-green-300 border-green-500/20"
                      : diff === "Medium"
                      ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                      : "bg-red-500/10 text-red-300 border-red-500/20"
                  }
                  text-xs py-0 h-5
                `}
              >
                {diff}
              </Badge>
            ))}

            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-zinc-800/60 text-zinc-300 border-zinc-700/30 text-xs py-0 h-5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SleekHeader;
