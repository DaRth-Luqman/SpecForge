import OpenAI from "openai";

// Using Groq's OpenAI-compatible endpoint
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateOpenAIResponse = async (prompt, file = null) => {
  // Build plain text content (Groq llama3-70b-8192 is text-only)
  let userContent = prompt;

  // Note: image attachments are not supported by llama3-70b-8192.
  // If an image file is provided, append a notice so the model is aware.
  if (file && file.mimetype.startsWith("image")) {
    userContent += "\n\n[Note: An image file was attached but vision input is not supported by this model.]";
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a world-class Software Architect. You provide high-IQ, structured engineering plans. You must respond strictly in JSON format. Do not include markdown code blocks. Ensure all array fields are populated with deeply technical insights.",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  return response.choices[0].message.content;
};