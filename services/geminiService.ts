import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GENIE_SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

const getAiClient = () => {
  // La chiave viene ottenuta esclusivamente dall'ambiente di esecuzione
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY non trovata nell'ambiente di esecuzione.");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = () => {
  const ai = getAiClient();
  chatSession = ai.chats.create({
    // Usiamo il modello Flash: più veloce ed economico del Pro
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: GENIE_SYSTEM_INSTRUCTION,
      temperature: 0.9,
    },
  });
  return chatSession;
};

export const sendMessageToGenie = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
      throw new Error("Sessione non inizializzata");
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message,
    });
    return result.text || "Oioioi! Mi si è incriccato il collo magico. Riprova!";
  } catch (error) {
    console.error("Errore comunicazione con il Genio:", error);
    // In caso di errore di autenticazione o quota, resettiamo la sessione
    chatSession = null;
    return "Argh! Interferenze cosmiche! I miei poteri sono momentaneamente... ridotti! Riprova più tardi!";
  }
};