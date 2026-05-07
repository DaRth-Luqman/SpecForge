export const parseResponse = (text) => {
    try {
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        return {
            category: "unknown",
            difficulty: "medium",
            phases: [],
            diagrams: [],
            pitfalls: [],
            concepts: [],
        };
    }
};