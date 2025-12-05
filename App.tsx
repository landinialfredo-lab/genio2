import React, { useState } from 'react';
import LampTrigger from './components/LampTrigger';
import ChatInterface from './components/ChatInterface';
import { Message, Role } from './types';
import { sendMessageToGenieStream, initializeChat } from './services/geminiService';
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

    // 2. Create a placeholder for the Genie's message immediately
    const genieMsgId = (Date.now() + 1).toString();
    const initialGenieMsg: Message = {
      id: genieMsgId,
      role: Role.MODEL,
      text: "...", // Placeholder that will be overwritten instantly
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, initialGenieMsg]);

    try {
      // 3. Call streaming service
      await sendMessageToGenieStream(text, (currentText) => {
        // This callback runs every time a new chunk of text arrives
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === genieMsgId 
              ? { ...msg, text: currentText } 
              : msg
          )
        );
      });
      
    } catch (error) {
      console.error("Failed to get response", error);
      // Update the placeholder with an error message if it fails completely
       setMessages((prev) => 
          prev.map((msg) => 
            msg.id === genieMsgId 
              ? { ...msg, text: "Oioioi! Qualcosa è andato storto nella lampada!" } 
              : msg
          )
        );
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