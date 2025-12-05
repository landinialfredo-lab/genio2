import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GENIE_SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = () => {
  const ai = getAiClient();
  chatSession = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: GENIE_SYSTEM_INSTRUCTION,
      temperature: 0.9, // Creative and erratic
      // Removed maxOutputTokens to prevent potential cut-off errors with the Pro model
    },
  });
  return chatSession;
};

export const sendMessageToGenie = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message,
    });
    return result.text || "Oioioi! Mi si è incriccato il collo magico. Riprova!";
  } catch (error) {
    console.error("Error talking to Genie:", error);
    // Restart session on error just in case
    chatSession = null;
    return "Argh! Interferenze cosmiche! I miei poteri sono momentaneamente... ridotti! Riprova, Al!";
  }
};