import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { Persona } from '../types';

const metaPromptTemplate = (personaPrompt: string, userTask: string) => `
You are a world-class prompt engineering expert. Your task is to take a user's goal and rewrite it into a detailed, structured prompt that conforms to the specifications of a target AI persona.

**Target AI Persona System Prompt:**
---
${personaPrompt}
---

**User's Goal:**
---
${userTask}
---

**Your Instructions:**
1.  Deeply analyze the user's goal to understand their true intent.
2.  Analyze the rules, format, roles, and directives defined in the "Target AI Persona System Prompt."
3.  Rewrite the user's goal into a new, complete, and highly-detailed prompt that is perfectly formatted FOR the target persona.
4.  The new prompt must fully incorporate the user's goal while strictly adhering to all formatting rules, role-playing instructions, and constraints of the target persona.
5.  IMPORTANT: Your entire output must be ONLY the final, rewritten prompt text. Do NOT output any explanation, conversation, or introductory phrases like "Here is the optimized prompt:". Your response should start directly with the content of the rewritten prompt.
`;

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set on the server.");
        return response.status(500).json({ error: 'Server configuration error. API key is missing.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { persona, userTask } = request.body as { persona: Persona; userTask: string };

        if (!persona || !userTask) {
            return response.status(400).json({ error: 'Missing persona or userTask in request body.' });
        }

        const metaPrompt = metaPromptTemplate(persona.prompt, userTask);
        
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: metaPrompt,
            config: {
                temperature: 0.5,
                topP: 0.95,
            }
        });
        
        const optimizedPrompt = result.text.trim();
        
        response.status(200).json({ prompt: optimizedPrompt });

    } catch (error) {
        console.error("Error calling Gemini API from server:", error);
        response.status(500).json({ error: 'Failed to communicate with the Gemini API.' });
    }
}
