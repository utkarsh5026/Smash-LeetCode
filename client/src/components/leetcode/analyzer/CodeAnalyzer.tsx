import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Clock,
  Code2,
  Layers,
  LineChart,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AlternativeApproaches from "./AlternativeApproaches";
import ComplexityAnalysis from "./ComplexityAnalysis";
import CodeStyle from "./CodeStyle";

// Types for our component
interface CodeQualityAnalyzerProps {
  userCode: string;
  language: string;
  problemName: string;
  problemDifficulty: string;
  isAnalyzing?: boolean;
  onRunAnalysis?: () => void;
}

interface ComplexityAnalysis {
  time: string;
  space: string;
  timeExplanation: string;
  spaceExplanation: string;
  performance: number; // 0-100
}

interface StyleAnalysis {
  score: number; // 0-100
  suggestions: {
    type: "naming" | "formatting" | "structure" | "documentation";
    description: string;
    line?: number;
  }[];
}

interface AlternativeApproach {
  name: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  pros: string[];
  cons: string[];
  codeSnippet: string;
}

const CodeQualityAnalyzer: React.FC<CodeQualityAnalyzerProps> = ({
  userCode,
  language,
  problemName,
  problemDifficulty,
  isAnalyzing = false,
  onRunAnalysis,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("complexity");

  // Mock data - in a real implementation, this would come from an API
  const [complexityAnalysis, setComplexityAnalysis] =
    useState<ComplexityAnalysis>({
      time: "O(n)",
      space: "O(n)",
      timeExplanation:
        "Your solution uses a single pass through the array, resulting in O(n) time complexity. This is optimal for this problem as we need to consider each element at least once.",
      spaceExplanation:
        "You're using a hash map to store previously seen values, which in the worst case will store all n elements, leading to O(n) space complexity.",
      performance: 85,
    });

  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis>({
    score: 78,
    suggestions: [
      {
        type: "naming",
        description:
          'Consider using more descriptive variable names instead of single letters like "i" and "j".',
        line: 3,
      },
      {
        type: "documentation",
        description:
          "Adding comments explaining the algorithm would improve readability and maintainability.",
      },
      {
        type: "structure",
        description:
          "Consider breaking down the nested loops into separate functions for better readability.",
        line: 7,
      },
    ],
  });

  const [alternativeApproaches, setAlternativeApproaches] = useState<
    AlternativeApproach[]
  >([
    {
      name: "Two-Pointer Approach",
      description:
        "This approach uses two pointers moving from opposite ends of a sorted array.",
      complexity: {
        time: "O(n)",
        space: "O(1)",
      },
      pros: [
        "Uses constant extra space",
        "Simple implementation",
        "Good for sorted arrays",
      ],
      cons: [
        "Requires the array to be sorted first",
        "Not applicable to all problem variations",
      ],
      codeSnippet: `function twoSum(nums, target) {
  // First sort the array with indices
  const indexedNums = nums.map((num, idx) => ({ num, idx }));
  indexedNums.sort((a, b) => a.num - b.num);
  
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = indexedNums[left].num + indexedNums[right].num;
    if (sum === target) {
      return [indexedNums[left].idx, indexedNums[right].idx];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return null;
}`,
    },
    {
      name: "Hash Map Approach",
      description:
        "This approach uses a hash map to store values as they're encountered.",
      complexity: {
        time: "O(n)",
        space: "O(n)",
      },
      pros: [
        "Single pass through the array",
        "Works on unsorted arrays",
        "Optimal time complexity",
      ],
      cons: ["Uses additional space for the hash map"],
      codeSnippet: `function twoSum(nums, target) {
  const seen = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }
    
    seen[nums[i]] = i;
  }
  
  return null;
}`,
    },
  ]);

  // Simulate fetching analysis data
  useEffect(() => {
    if (isAnalyzing) {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        // Analysis complete - data would be updated from API response
        if (onRunAnalysis) onRunAnalysis();
      }, 2000);
    }
  }, [isAnalyzing, onRunAnalysis]);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-md">
            <BarChart className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Code Quality Analysis
            </h3>
            <p className="text-xs text-zinc-400">
              Optimizing your solution for "{problemName}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={
              problemDifficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : problemDifficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }
          >
            {problemDifficulty}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mx-auto mb-4"
                  >
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Analyzing Your Code
                  </h3>
                  <p className="text-zinc-400 max-w-md">
                    We're examining time & space complexity, code style, and
                    comparing with alternative approaches...
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="px-4 pt-4">
                    <TabsList className="bg-zinc-800/50 p-1">
                      <TabsTrigger
                        value="complexity"
                        className="data-[state=active]:bg-zinc-700"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Complexity
                      </TabsTrigger>
                      <TabsTrigger
                        value="style"
                        className="data-[state=active]:bg-zinc-700"
                      >
                        <Code2 className="h-4 w-4 mr-2" />
                        Style
                      </TabsTrigger>
                      <TabsTrigger
                        value="alternatives"
                        className="data-[state=active]:bg-zinc-700"
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Alternatives
                      </TabsTrigger>
                      <TabsTrigger
                        value="benchmarks"
                        className="data-[state=active]:bg-zinc-700"
                      >
                        <LineChart className="h-4 w-4 mr-2" />
                        Benchmarks
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="complexity" className="px-4 py-4">
                    <ComplexityAnalysis
                      complexityAnalysis={complexityAnalysis}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="px-4 py-4">
                    <CodeStyle
                      language={language}
                      code={userCode}
                      styleAnalysis={styleAnalysis}
                    />
                  </TabsContent>

                  <TabsContent value="alternatives" className="px-4 py-4">
                    <AlternativeApproaches
                      alternativeApproaches={alternativeApproaches}
                      language={language}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeQualityAnalyzer;
