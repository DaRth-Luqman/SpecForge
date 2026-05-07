import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIResponse = async (prompt) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a world-class Software Architect. You provide high-IQ, structured engineering plans. You must respond strictly in JSON format. Do not include markdown code blocks. Ensure all array fields are populated with deeply technical insights.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  return response.choices[0].message.content;
};