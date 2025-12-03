import React from 'react';

interface GenieAvatarProps {
  isThinking: boolean;
}

const GenieAvatar: React.FC<GenieAvatarProps> = ({ isThinking }) => {
  return (
    <div className="absolute bottom-24 right-0 md:bottom-20 md:right-4 z-30 pointer-events-none overflow-hidden h-[35vh] w-full flex justify-end items-end pr-4 md:pr-8">
      <div className="relative flex justify-center items-end">
        
        {/* Magical Aura/Glow - Pulsing Blue - Resized */}
        <div className={`absolute bottom-0 w-48 h-48 bg-indigo-500 rounded-full blur-[60px] opacity-40 mix-blend-screen transition-all duration-500 ${isThinking ? 'scale-125 opacity-60 bg-fuchsia-500' : 'scale-100'}`}></div>

        {/* Rotating Magic Circle (Visible only when thinking) - Resized */}
        <div className={`absolute bottom-8 w-[120%] h-[120%] border-[3px] border-dashed border-amber-300/40 rounded-full animate-spin-slow transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute bottom-12 w-[90%] h-[90%] border-[2px] border-dotted border-white/30 rounded-full animate-spin-slow transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-0'}`} style={{ animationDirection: 'reverse', animationDuration: '5s' }}></div>

        {/* Magic Sparkles */}
        <div className={`absolute inset-0 z-40 transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute top-10 right-10 w-3 h-3 bg-yellow-300 rounded-full blur-[2px] animate-ping"></div>
             <div className="absolute bottom-16 left-4 w-2 h-2 bg-white rounded-full blur-[1px] animate-ping delay-75"></div>
             <div className="absolute top-1/2 left-0 w-2 h-2 bg-cyan-300 rounded-full animate-ping delay-150"></div>
             <div className="absolute top-0 right-1/2 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping delay-300"></div>
        </div>

        {/* SVG Generated Genie - Cartoon Style - Resized (w-40 md:w-56) */}
        <div className={`relative transition-all duration-300 drop-shadow-2xl ${isThinking ? 'animate-shake scale-105 filter brightness-110' : 'animate-float'}`}>
          <svg width="280" height="320" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 md:w-56 h-auto filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id="skinGradient" x1="100" y1="0" x2="100" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#3B82F6"/>
                <stop offset="1" stopColor="#1D4ED8"/>
              </linearGradient>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FCD34D"/>
                <stop offset="0.5" stopColor="#F59E0B"/>
                <stop offset="1" stopColor="#B45309"/>
              </linearGradient>
            </defs>

            {/* Body Base (Ghost tail) */}
            <path d="M100 240C140 240 160 200 150 160C140 120 60 120 50 160C40 200 60 240 100 240Z" fill="url(#skinGradient)" />
            
            {/* Broad Chest/Shoulders */}
            <path d="M40 160C20 140 30 90 60 80C60 80 140 80 140 80C170 90 180 140 160 160" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>

            {/* Crossed Arms */}
            <path d="M40 160C40 160 80 180 100 170" stroke="#3B82F6" strokeWidth="25" strokeLinecap="round"/>
            <path d="M160 160C160 160 120 180 100 170" stroke="#3B82F6" strokeWidth="25" strokeLinecap="round"/>
            
            {/* Gold Wrist Cuffs */}
            <rect x="45" y="150" width="15" height="25" rx="2" transform="rotate(15 52 162)" fill="url(#goldGradient)" stroke="#92400E" strokeWidth="1"/>
            <rect x="140" y="150" width="15" height="25" rx="2" transform="rotate(-15 147 162)" fill="url(#goldGradient)" stroke="#92400E" strokeWidth="1"/>

            {/* Hands/Fingers (Cartoonish) */}
            <circle cx="90" cy="165" r="10" fill="#60A5FA"/>
            <circle cx="110" cy="165" r="10" fill="#60A5FA"/>

            {/* Neck */}
            <path d="M85 80L85 60L115 60L115 80" fill="#3B82F6"/>

            {/* Head */}
            <ellipse cx="100" cy="45" rx="35" ry="40" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Ears */}
            <path d="M65 45C55 40 55 55 67 50" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1"/>
            <path d="M135 45C145 40 145 55 133 50" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Gold Earring */}
            <circle cx="138" cy="55" r="4" fill="none" stroke="#F59E0B" strokeWidth="2"/>

            {/* Facial Features */}
            {/* Eyes */}
            <g fill="white">
                <ellipse cx="90" cy="40" rx="8" ry="10"/>
                <ellipse cx="110" cy="40" rx="8" ry="10"/>
            </g>
            <g fill="black">
                <circle cx="92" cy="40" r="3"/>
                <circle cx="108" cy="40" r="3"/>
            </g>
            {/* Eyebrows */}
            <path d="M80 30Q90 20 100 30" fill="none" stroke="black" strokeWidth="2"/>
            <path d="M100 30Q110 20 120 30" fill="none" stroke="black" strokeWidth="2"/>

            {/* Nose */}
            <path d="M100 40Q90 55 105 55" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round"/>

            {/* Mouth (Smile) */}
            <path d="M90 65Q100 75 110 65" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Beard (Swirly) */}
            <path d="M100 68Q100 80 110 75Q105 85 100 85Q95 85 90 75Q100 80 100 68Z" fill="black"/>

            {/* Hair Topknot */}
            <path d="M90 10C90 0 110 0 110 10" fill="black"/>
            <path d="M100 5L120 -10Q130 -15 125 -5L110 8" fill="black"/>
            <rect x="92" y="5" width="16" height="5" fill="#F59E0B"/>
            
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GenieAvatar;