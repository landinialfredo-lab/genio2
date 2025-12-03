
import React, { useRef, useEffect, useState } from 'react';
import { Message, Role } from '../types';
import GenieAvatar from './GenieAvatar';
import { speakGenie, stopGenieSpeech } from '../services/ttsService';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Default false per non disturbare, utente deve attivare
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Gestione TTS (Sintesi Vocale)
  useEffect(() => {
    // Se ci sono nuovi messaggi e l'audio è attivo
    if (messages.length > prevMessagesLength.current) {
        const lastMessage = messages[messages.length - 1];
        
        // Se l'ultimo messaggio è del Genio, leggilo
        if (isAudioEnabled && lastMessage.role === Role.MODEL) {
            speakGenie(lastMessage.text);
        }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, isAudioEnabled]);

  const toggleAudio = () => {
      if (isAudioEnabled) {
          stopGenieSpeech();
          setIsAudioEnabled(false);
      } else {
          setIsAudioEnabled(true);
          // Opzionale: Leggi l'ultimo messaggio se si attiva l'audio
          const lastGenieMsg = [...messages].reverse().find(m => m.role === Role.MODEL);
          if (lastGenieMsg) {
              speakGenie(lastGenieMsg.text);
          }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      stopGenieSpeech(); // Ferma il genio se l'utente parla sopra
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  // Funzione per renderizzare il testo con formattazione markdown-like
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-amber-600 font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="text-indigo-800 italic">{part.slice(1, -1)}</em>;
        }
        return part;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 relative font-body overflow-hidden">
        {/* Magical Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-0"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-fuchsia-600 rounded-full blur-[100px] opacity-20 z-0"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500 rounded-full blur-[100px] opacity-10 z-0"></div>

      {/* Header - Increased Top Padding (pt-12) to move text down. Increased Opacity (/95) */}
      <div className="z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 pb-4 pt-12 md:pt-6 sticky top-0 flex items-center justify-between shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3">
            {/* Avatar Icon - Replaced broken IMG with SVG Face */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300/50 shadow-inner bg-indigo-600 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 translate-y-1">
                     <defs>
                        <linearGradient id="iconSkin" x1="0" y1="0" x2="0" y2="100">
                        <stop offset="0" stopColor="#60A5FA"/>
                        <stop offset="1" stopColor="#3B82F6"/>
                        </linearGradient>
                    </defs>
                    <ellipse cx="50" cy="50" rx="35" ry="40" fill="url(#iconSkin)"/>
                    {/* Eyes */}
                    <g fill="white">
                        <ellipse cx="40" cy="45" rx="8" ry="10"/>
                        <ellipse cx="60" cy="45" rx="8" ry="10"/>
                    </g>
                    <g fill="black">
                        <circle cx="42" cy="45" r="3"/>
                        <circle cx="58" cy="45" r="3"/>
                    </g>
                    {/* Eyebrows */}
                    <path d="M30 35Q40 25 50 35" fill="none" stroke="black" strokeWidth="2"/>
                    <path d="M50 35Q60 25 70 35" fill="none" stroke="black" strokeWidth="2"/>
                    {/* Nose */}
                    <path d="M50 45Q40 60 55 60" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round"/>
                    {/* Mouth */}
                    <path d="M40 70Q50 80 60 70" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                     {/* Beard */}
                     <path d="M50 73Q50 85 60 80Q55 90 50 90Q45 90 40 80Q50 85 50 73Z" fill="black"/>
                     {/* Hair */}
                     <path d="M50 5L70 -10Q80 -15 75 -5L60 8" fill="black"/>
                     <rect x="42" y="5" width="16" height="5" fill="#F59E0B"/>
                </svg>
            </div>
            <div>
                <h2 className="font-display text-amber-400 font-bold text-xl drop-shadow-md">Il Genio</h2>
                <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-green-500'} `}></span>
                    <span className="text-xs text-indigo-200 font-semibold tracking-wide">{isLoading ? 'Evocando poteri...' : 'Online'}</span>
                </div>
            </div>
        </div>
        
        {/* Audio Toggle Button */}
        <button 
            onClick={toggleAudio}
            className={`p-2 rounded-full transition-all duration-300 ${isAudioEnabled ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-slate-800 text-slate-400'}`}
            title={isAudioEnabled ? "Disattiva Voce" : "Attiva Voce del Genio"}
        >
            {isAudioEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                     <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                </svg>
            )}
        </button>
      </div>

      {/* Animated Genie Avatar - Z-Index 30 */}
      <GenieAvatar isThinking={isLoading} />

      {/* Messages Area - Modified to align text to bottom */}
      <div className="flex-1 overflow-y-auto p-4 z-10 scrollbar-hide pb-32 flex flex-col">
        <div className="mt-auto space-y-6">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
            >
                <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-lg relative transition-all duration-200 hover:scale-[1.01] ${
                    msg.role === Role.USER
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20'
                    : 'bg-gradient-to-br from-amber-50 to-amber-100 text-indigo-900 rounded-tl-none border-2 border-amber-300/50 shadow-amber-500/10'
                }`}
                >
                <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                    {msg.role === Role.MODEL ? renderFormattedText(msg.text) : msg.text}
                </div>
                <div className={`text-[10px] mt-2 opacity-60 font-bold ${msg.role === Role.USER ? 'text-right text-indigo-200' : 'text-left text-amber-800'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                </div>
            </div>
            ))}
            {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 rounded-tl-none border border-white/10 shadow-lg">
                <div className="flex space-x-2 items-center h-6">
                    <div className="w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(232,121,249,0.5)]" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(129,140,248,0.5)]" style={{ animationDelay: '0.4s' }}></div>
                </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Z-Index 50 to stay above Avatar */}
      <div className="z-50 bg-slate-900/90 backdrop-blur-xl p-4 border-t border-white/10 sticky bottom-0 safe-pb">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Chiedi un desiderio..."
            className="flex-1 bg-slate-800/60 text-white placeholder-indigo-300/40 border border-indigo-500/30 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.4)] border-2 border-amber-300/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 transform -rotate-45 translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
