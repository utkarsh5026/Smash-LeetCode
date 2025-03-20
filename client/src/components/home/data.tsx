import {
  Brackets,
  Terminal,
  BarChart4,
  Hash,
  GitBranch,
  Network,
  Filter,
  Search,
  Code2,
  Brain,
  Zap,
} from "lucide-react";

export const featuredProblems = [
  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    rating: 4.8,
    acceptance: "47.2%",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  },
  {
    id: 121,
    name: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    rating: 4.7,
    acceptance: "52.3%",
    description:
      "You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell that stock.",
  },
  {
    id: 217,
    name: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "Sorting"],
    rating: 4.5,
    acceptance: "59.5%",
    description:
      "Return true if any value appears at least twice in the array, and return false if every element is distinct.",
  },
  {
    id: 53,
    name: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    rating: 4.9,
    acceptance: "49.1%",
    description:
      "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
  },
  {
    id: 3,
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    rating: 4.6,
    acceptance: "33.8%",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
  },
  {
    id: 42,
    name: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    rating: 4.9,
    acceptance: "57.8%",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
  },
];

export const popularTopics = [
  { name: "Arrays", icon: <Brackets className="w-4 h-4" />, count: 856 },
  { name: "Strings", icon: <Terminal className="w-4 h-4" />, count: 643 },
  {
    name: "Dynamic Programming",
    icon: <BarChart4 className="w-4 h-4" />,
    count: 502,
  },
  { name: "Hash Tables", icon: <Hash className="w-4 h-4" />, count: 389 },
  { name: "Trees", icon: <GitBranch className="w-4 h-4" />, count: 347 },
  { name: "Graph", icon: <Network className="w-4 h-4" />, count: 319 },
  { name: "Sorting", icon: <Filter className="w-4 h-4" />, count: 283 },
  { name: "Binary Search", icon: <Search className="w-4 h-4" />, count: 245 },
];

export const snippets = [
  {
    language: "Python",
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    problem: "Two Sum",
  },
  {
    language: "JavaScript",
    code: `var maxSubArray = function(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
};`,
    problem: "Maximum Subarray",
  },
];

export const features = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "200+ Curated Challenges",
    description:
      "From array manipulation to dynamic programming, our challenges cover every essential algorithm and data structure.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI-Powered Solutions",
    description:
      "Get step-by-step explanations and personalized hints when you're stuck, using our advanced AI assistant.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Multiple Language Support",
    description:
      "Practice in Python, JavaScript, Java, C++, TypeScript, Go, and more to strengthen your versatility.",
  },
  {
    icon: <BarChart4 className="w-5 h-5" />,
    title: "Performance Analytics",
    description:
      "Track your progress, identify weak points, and visualize your growth with detailed performance metrics.",
  },
];

export const difficultyLevels = [
  {
    level: "Easy",
    color: "bg-green-500/90",
    count: 75,
    description:
      "Perfect for beginners to build confidence with array manipulation, basic data structures, and simple algorithms.",
    examples: ["Two Sum", "Valid Parentheses", "Reverse Linked List"],
  },
  {
    level: "Medium",
    color: "bg-yellow-500/90",
    count: 95,
    description:
      "Challenge yourself with BFS/DFS, dynamic programming, and intermediate data structures like trees and graphs.",
    examples: ["LRU Cache", "Validate Binary Search Tree", "Course Schedule"],
  },
  {
    level: "Hard",
    color: "bg-red-500/90",
    count: 35,
    description:
      "Master complex algorithms like advanced dynamic programming, complex graph theory, and optimization problems.",
    examples: [
      "Median of Two Sorted Arrays",
      "Merge k Sorted Lists",
      "Regular Expression Matching",
    ],
  },
];
