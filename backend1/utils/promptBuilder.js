export const buildPrompt = (text, domain) => {
    return `
You are an expert software architecture mentor.

Analyze the assignment below.

DO NOT write code.

DO NOT add explanations.

Return ONLY valid JSON in this exact format:

{
  "category": "",
  "difficulty": "",
  "phases": [],
  "diagrams": [],
  "pitfalls": [],
  "concepts": []
}

Assignment:
${text}

Domain:
${domain}
`;
};