export const getComplexityColor = (complexity: string) => {
  if (complexity === "O(1)") return "bg-green-500/20 text-green-400";
  if (complexity === "O(n)") return "bg-yellow-500/20 text-yellow-400";
  if (complexity === "O(n^2)") return "bg-red-500/20 text-red-400";
  return "bg-zinc-800 text-zinc-400";
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
};
