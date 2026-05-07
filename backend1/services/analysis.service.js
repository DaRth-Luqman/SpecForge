import { generateOpenAIResponse } from "./openai.service.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { parseResponse } from "../utils/responseParser.js";
import { detectDomain } from "../utils/domainDetector.js";
import { injectEdgeCases } from "../utils/edgeCaseInjector.js";

export const analyzeService = async ({ text }) => {

    const domain = detectDomain(text);

    const prompt = buildPrompt(text, domain);

    const raw = await generateOpenAIResponse(prompt);

    let parsed = parseResponse(raw);

    parsed = injectEdgeCases(parsed, domain);

    return parsed;
};