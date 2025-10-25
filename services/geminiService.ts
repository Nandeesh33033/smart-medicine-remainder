
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This assumes the API_KEY is set in the environment.
// In a real-world scenario, this key should be handled securely on a backend server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. The 'Ask Gemini' feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getMedicineInfo(medicineName: string): Promise<string> {
  if (!API_KEY) {
    return "Gemini API key is not configured. Please ask your administrator to set it up.";
  }
  
  try {
    const prompt = `Provide a brief, easy-to-understand summary for a patient about the medication "${medicineName}". Include what it's generally used for and one common, simple tip for taking it. Keep the response to 2-3 sentences.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching data from Gemini API:", error);
    return "Sorry, I couldn't fetch information at this time. Please try again later.";
  }
}
