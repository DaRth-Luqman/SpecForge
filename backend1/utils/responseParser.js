export const parseResponse = (text) => {
    try {
        console.log("RAW AI RESPONSE:", text);
        
        // Find the first '{' and last '}' to extract the JSON object
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
            throw new Error("No JSON object found in response");
        }
        
        const jsonString = text.substring(start, end + 1);
        const parsed = JSON.parse(jsonString);

        // Normalize keys if AI uses the ones from the prompt directly
        return {
            category: parsed.contentType || parsed.category || "General",
            difficulty: parsed.complexityEstimate || parsed.difficulty || "Intermediate",
            phases: parsed.phaseBreakdown || parsed.phases || [],
            diagrams: parsed.blueprintRecommendations || parsed.diagrams || [],
            pitfalls: parsed.edgeCases || parsed.pitfalls || [],
            concepts: parsed.conceptGuide || parsed.concepts || [],
        };
    } catch (err) {
        console.error("JSON Parse Error:", err.message);
        return {
            category: "General",
            difficulty: "Intermediate",
            phases: ["Parsing Error: Could not structure the execution plan."],
            diagrams: [],
            pitfalls: ["Check if the AI prompt is valid or if the API returned an unexpected format."],
            concepts: [],
        };
    }
};