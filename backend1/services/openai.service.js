import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIResponse = async (prompt, file = null) => {
  const content = [
    {
      type: "text",
      text: prompt,
    },
  ];

  if (file && file.mimetype.startsWith("image")) {
    const base64Image = file.buffer.toString("base64");
    content.push({
      type: "image_url",
      image_url: {
        url: `data:${file.mimetype};base64,${base64Image}`,
      },
    });
  }

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
        content: content,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  return response.choices[0].message.content;
};