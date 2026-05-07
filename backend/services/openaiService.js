const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const analyzeAssignment = async (assignmentText) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from environment variables.");
  }

  const systemPrompt = `
    You are an elite Senior Technical Teaching Assistant and Software Architect.
    A student has provided you with their technical assignment prompt.
    Your job is NOT to write code or solve the assignment for them. 
    Your job is to analyze the assignment and generate a structured engineering execution plan.

    Return ONLY a valid JSON object matching exactly this structure, with no extra keys:
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
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: assignmentText }
      ],
      response_format: { type: "json_object" }
    });

    const rawText = response.choices[0].message.content;
    
    // Safely parse the JSON
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", rawText);
      throw new Error("Invalid JSON returned by OpenAI API.");
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
    console.error("OpenAI API Service Error:", error);
    throw error;
  }
};

module.exports = {
  analyzeAssignment
};
