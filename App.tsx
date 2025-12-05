import React, { useState } from 'react';
import LampTrigger from './components/LampTrigger';
import ChatInterface from './components/ChatInterface';
import { Message, Role } from './types';
import { sendMessageToGenie, initializeChat } from './services/geminiService';
import { logInteraction } from './services/loggingService';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to start the chat (simulates rubbing the lamp/NFC tap)
  const handleLampRub = () => {
    setIsActive(true);
    initializeChat();
    
    // Add initial greeting after a short delay for effect
    setTimeout(() => {
        setMessages([
          {
            id: 'init-1',
            role: Role.MODEL,
            text: INITIAL_GREETING,
            timestamp: new Date(),
          },
        ]);
    }, 800);
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Note: We moved logging to AFTER the response so we can log pairs (Question + Answer)

    try {
      // 2. Call service (standard await)
      const responseText = await sendMessageToGenie(text);
      
      const genieMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, genieMsg]);

      // 3. Log the full interaction
      logInteraction(text, responseText).catch(err => console.error("Logging error", err));
      
    } catch (error) {
      console.error("Failed to get response", error);
      const errorMsgText = "Oioioi! Qualcosa è andato storto nella lampada!";
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: errorMsgText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      
      // Log the error as the answer so we know it failed
      logInteraction(text, `ERROR: ${errorMsgText}`).catch(err => console.error("Logging error", err));

    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) {
    return <LampTrigger onRub={handleLampRub} />;
  }

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
    />
  );
};

export default App;