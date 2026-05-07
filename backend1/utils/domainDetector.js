export const detectDomain = (text) => {
  text = text.toLowerCase();

  if (text.includes("semaphore") || text.includes("fork")) return "os";
  if (text.includes("maze") || text.includes("a*")) return "ai";
  if (text.includes("sql") || text.includes("er diagram")) return "dbms";

  return "general";
};