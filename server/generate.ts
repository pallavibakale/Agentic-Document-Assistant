import { ai, MODELS } from './gemini';
import { DocumentData, AIResponse } from '../types';
import { Type } from "@google/genai";

export async function generateDraft(prompt: string): Promise<AIResponse<DocumentData>> {
  try {
    const systemInstruction = `
      You are an expert legal and technical document drafter.
      Your task is to generate a STRUCTURED document based on the user's prompt.
      
      RULES:
      1. Output must be strict JSON.
      2. The structure represents a document outline.
      3. 'sections' is an array of objects with 'title' (string) and 'content' (array of strings, where each string is a paragraph).
      4. Do not use Markdown formatting in the text strings.
      5. Keep it professional and clear.
    `;

    const response = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as DocumentData;
    return { success: true, data };

  } catch (error: any) {
    console.error("Draft Generation Error:", error);
    return { success: false, error: error.message || "Failed to generate draft" };
  }
}
