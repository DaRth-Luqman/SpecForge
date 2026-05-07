export const injectEdgeCases = (data, domain) => {

    if (domain === "os") {
        data.pitfalls.push("Deadlock risk: Ensure semaphore acquire/release operations are symmetric. Circular wait is the most common failure mode.");
        data.pitfalls.push("fork() returns 0 in child and child PID in parent — swapping these causes logic inversion in process trees.");
    }

    if (domain === "ai") {
        data.pitfalls.push("Critical (row, column) indexing trap: grid[row][col] ≠ grid[x][y]. Confusing (x,y) Cartesian coordinates with (row,col) matrix indexing is the #1 off-by-one error in 2D grid pathfinding.");
        data.pitfalls.push("A* heuristic must be admissible (never overestimates). Using Euclidean distance for a grid that only allows 4-directional movement will produce suboptimal paths.");
    }

    return data;
};