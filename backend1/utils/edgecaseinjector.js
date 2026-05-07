export const injectEdgeCases = (data, domain) => {

    if (domain === "os") {
        data.pitfalls.push("Deadlock risk in semaphore usage");
    }

    if (domain === "ai") {
        data.pitfalls.push("Incorrect grid indexing (row/col confusion)");
    }

    return data;
};