const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analyzeAssignment = async (assignmentText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }

  const prompt = `
    You are an elite Senior Technical Teaching Assistant and Software Architect.
    A student has provided you with their technical assignment prompt.
    Your job is NOT to write code or solve the assignment for them. 
    Your job is to analyze the assignment and generate a structured engineering execution plan.

    Analyze the following assignment text and provide a structured JSON response.
    The JSON MUST strictly follow this exact structure, with no additional keys:
    {
      "assignmentDomain": "String identifying the core technical domain (e.g., Full-Stack Web Development, Machine Learning, Systems Programming)",
      "phaseBreakdown": [
        {
          "phase": "String name of the phase",
          "tasks": ["Array of string tasks for this phase"]
        }
      ],
      "edgeCases": ["Array of string potential hidden edge cases, technical pitfalls, or things to watch out for"],
      "blueprintRecommendations": ["Array of strings describing recommended architecture diagrams or system designs they should draw"],
      "conceptGuide": ["Array of string prerequisite concepts or technologies the student should revise before starting"],
      "complexityEstimate": "String estimating complexity (e.g., Beginner, Intermediate, Advanced, Expert) and a brief reason",
      "firstSteps": ["Array of string concrete, immediate first steps to kick off the project"],
      "engineeringWorkflow": ["Array of string steps suggesting the best engineering workflow (e.g., Agile, TDD, specific branching strategy)"]
    }

    Do NOT include markdown blocks like \`\`\`json or \`\`\`.
    Do NOT write full solutions or code implementation details. Focus strictly on planning and architecture.
    Return ONLY valid JSON.

    Assignment Text:
    ${assignmentText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const rawText = response.text;
    
    // Safely parse the JSON
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", rawText);
      throw new Error("Invalid JSON returned by Gemini API.");
    }

    // Ensure all expected arrays exist to prevent frontend crashes
    return {
      assignmentDomain: result.assignmentDomain || "Unknown Domain",
      phaseBreakdown: Array.isArray(result.phaseBreakdown) ? result.phaseBreakdown : [],
      edgeCases: Array.isArray(result.edgeCases) ? result.edgeCases : [],
      blueprintRecommendations: Array.isArray(result.blueprintRecommendations) ? result.blueprintRecommendations : [],
      conceptGuide: Array.isArray(result.conceptGuide) ? result.conceptGuide : [],
      complexityEstimate: result.complexityEstimate || "Not Estimated",
      firstSteps: Array.isArray(result.firstSteps) ? result.firstSteps : [],
      engineeringWorkflow: Array.isArray(result.engineeringWorkflow) ? result.engineeringWorkflow : []
    };
  } catch (error) {
    console.error("Gemini API Service Error:", error);
    throw error;
  }
};

module.exports = {
  analyzeAssignment
};
