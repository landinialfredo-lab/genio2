import React, { useState } from 'react';
import LampTrigger from './components/LampTrigger';
import ChatInterface from './components/ChatInterface';
import { Message, Role } from './types';
import { sendMessageToGenie, initializeChat } from './services/geminiService';
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
    // Optimistic update for user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGenie(text);
      
      const genieMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, genieMsg]);
    } catch (error) {
      console.error("Failed to get response", error);
      // Optional: Add error message to chat
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