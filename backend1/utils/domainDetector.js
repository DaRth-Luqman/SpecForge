export const detectDomain = (text) => {
  text = text.toLowerCase();

  if (text.includes("semaphore") || text.includes("fork") || text.includes("deadlock") || text.includes("mutex")) return "os";
  if (
    text.includes("maze") || text.includes("a*") || text.includes("pathfinding") ||
    text.includes("neural") || text.includes("cnn") || text.includes("bfs") ||
    text.includes("dfs") || text.includes("heuristic") || text.includes("genetic algorithm")
  ) return "ai";
  if (text.includes("sql") || text.includes("er diagram")) return "dbms";

  return "general";
};