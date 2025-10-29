
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: string) => `You are a professional image analysis service. Analyze the provided image deeply and return your findings strictly in the specified JSON format. The entire JSON response, including all string values, must be in ${language}. Be detailed, visual, and factual in your descriptions. If any piece of information is uncertain, use the string "uncertain". If no image is provided, fill all string fields with "unavailable". You are not a chat assistant; do not provide any text or prose outside of the JSON structure.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, one-sentence summary of the image." },
        detailed_description: { type: Type.STRING, description: "A comprehensive, paragraph-long description of the image content and context." },
        objects_detected: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    attributes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    estimated_role: { type: Type.STRING },
                    location: { type: Type.STRING },
                },
                required: ["name", "attributes", "estimated_role", "location"]
            }
        },
        environment_context: {
            type: Type.OBJECT,
            properties: {
                setting_type: { type: Type.STRING, description: "e.g., 'indoors', 'outdoors', 'urban', 'natural'" },
                time_context: { type: Type.STRING, description: "e.g., 'daytime', 'night', 'golden hour'" },
                mood_or_tone: { type: Type.STRING, description: "e.g., 'joyful', 'somber', 'energetic', 'peaceful'" },
                activity_type: { type: Type.STRING, description: "The main activity depicted, e.g., 'celebration', 'work', 'leisure'" },
            },
            required: ["setting_type", "time_context", "mood_or_tone", "activity_type"]
        },
        visual_quality_analysis: {
            type: Type.OBJECT,
            properties: {
                focus_and_sharpness: { type: Type.STRING },
                lighting: { type: Type.STRING },
                framing_and_composition: { type: Type.STRING },
                aesthetic_notes: { type: Type.STRING },
            },
            required: ["focus_and_sharpness", "lighting", "framing_and_composition", "aesthetic_notes"]
        },
        text_in_image: {
            type: Type.OBJECT,
            properties: {
                has_text: { type: Type.BOOLEAN },
                transcribed_text: { type: Type.STRING },
                meaning_or_purpose: { type: Type.STRING },
            },
            required: ["has_text", "transcribed_text", "meaning_or_purpose"]
        },
        potential_use_cases: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        safety_and_sensitive_content: {
            type: Type.OBJECT,
            properties: {
                is_sensitive: { type: Type.BOOLEAN },
                notes: { type: Type.STRING },
            },
            required: ["is_sensitive", "notes"]
        },
        next_action_suggestion: { type: Type.STRING, description: "A suggested next step for a user, like 'Enhance lighting' or 'Identify main subject'." },
    },
    required: ["summary", "detailed_description", "objects_detected", "environment_context", "visual_quality_analysis", "text_in_image", "potential_use_cases", "safety_and_sensitive_content", "next_action_suggestion"]
};

export const analyzeImage = async (base64Image: string, mimeType: string, language: string): Promise<AnalysisResult> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    imagePart,
                    { text: "Analyze this image based on your instructions." }
                ]
            },
            config: {
                systemInstruction: getSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Failed to get a valid JSON response from the API.");
    }
};
