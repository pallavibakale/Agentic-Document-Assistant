import { ai, MODELS } from './gemini';
import { SectionData, AIResponse, SectionActionType } from '../types';
import { Type } from "@google/genai";

export async function processSectionAction(
  section: SectionData,
  action: SectionActionType
): Promise<AIResponse<SectionData>> {
  try {
    const actionPrompts: Record<SectionActionType, string> = {
      rewrite_formal: "Rewrite this section to be more formal, precise, and legally sound.",
      rewrite_simple: "Rewrite this section to be simple, easy to understand, and plain English.",
      summarize: "Summarize this section into a single concise paragraph, preserving key points.",
      expand: "Expand this section with more detail, examples, or necessary clauses."
    };

    const prompt = `
      Target Action: ${actionPrompts[action]}
      
      Current Section Title: "${section.title}"
      Current Content:
      ${section.content.map(p => `- ${p}`).join('\n')}
      
      Output the updated section structure. You may update the title if needed to reflect the change, but usually keep it similar.
    `;

    const response = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as SectionData;
    return { success: true, data };

  } catch (error: any) {
    console.error("Section Action Error:", error);
    return { success: false, error: error.message || "Failed to process section" };
  }
}
