import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client. 
// Note: In a real production app, this would be server-side to hide the key.
// For this demo structure, we initialize it here but treat this directory as "server" logic.
export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  FAST: 'gemini-2.5-flash-latest', 
  SMART: 'gemini-2.5-flash-latest' // Using flash for speed/cost balance in demo
};
