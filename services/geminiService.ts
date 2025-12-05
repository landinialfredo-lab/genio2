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
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: GENIE_SYSTEM_INSTRUCTION,
      temperature: 0.9, // Creative and erratic
      maxOutputTokens: 400, // Limit response length for speed and brevity
    },
  });
  return chatSession;
};

// Old method kept for fallback or specific uses, but we mostly use stream now
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
    return "Argh! Interferenze cosmiche! I miei poteri sono momentaneamente... ridotti! Riprova, Al!";
  }
};

// New Streaming Method
export const sendMessageToGenieStream = async (
  message: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    const resultStream = await chatSession.sendMessageStream({
      message: message,
    });

    let fullText = "";
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    
    return fullText || "Ehm... mi sono perso nei miei stessi poteri!";
  } catch (error) {
    console.error("Error talking to Genie (Stream):", error);
    const errorMsg = "Argh! Interferenze cosmiche! Riprova, Al!";
    onChunk(errorMsg);
    return errorMsg;
  }
};