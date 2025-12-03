import React, { useState, useRef, useEffect } from 'react';

interface LampTriggerProps {
  onRub: () => void;
}

const LampTrigger: React.FC<LampTriggerProps> = ({ onRub }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback prevented:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRubAndPlay = () => {
    // Se l'autoplay era stato bloccato, avviamo la musica ora che c'è un'interazione utente
    if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(e => console.log("Audio start failed:", e));
    }
    onRub();
  };

  useEffect(() => {
    // Tentativo di autoplay gentile all'avvio
    const audio = audioRef.current;
    if (audio) {
        audio.volume = 0.5;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(() => {
                // Silenziosamente fallisce se il browser blocca l'autoplay.
                // Non mostriamo errori rossi, aspettiamo il click dell'utente.
                console.log("Autoplay audio in attesa di interazione utente.");
                setIsPlaying(false);
            });
        }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 p-6 text-center overflow-hidden relative">
      
      {/* Audio Element - Arabian Nights */}
      <audio ref={audioRef} loop src="https://ia800605.us.archive.org/8/items/Aladdin_201706/01%20Arabian%20Nights.mp3" />

      {/* Music Control Button */}
      <button 
        onClick={toggleMusic}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-900/50 backdrop-blur-md border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-indigo-900 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] group"
        title={isPlaying ? "Disattiva Musica" : "Attiva Atmosfera"}
      >
        {isPlaying ? (
             <div className="relative">
                 {/* Equalizer animation */}
                 <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-3 w-3">
                    <span className="w-0.5 bg-current animate-[bounce_0.8s_infinite] h-2"></span>
                    <span className="w-0.5 bg-current animate-[bounce_1.2s_infinite] h-3"></span>
                    <span className="w-0.5 bg-current animate-[bounce_0.6s_infinite] h-1.5"></span>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
             </div>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
            </svg>
        )}
      </button>

      {/* Background Stars Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-50 pointer-events-none">
        {[...Array(20)].map((_, i) => (
           <div 
             key={i}
             className="absolute bg-white rounded-full animate-pulse"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               width: `${Math.random() * 3 + 1}px`,
               height: `${Math.random() * 3 + 1}px`,
               animationDuration: `${Math.random() * 3 + 2}s`
             }}
           />
        ))}
      </div>

      <div className="z-10 animate-float mb-8">
        <svg
          viewBox="0 0 512 512"
          className="w-64 h-64 drop-shadow-[0_0_35px_rgba(250,204,21,0.6)] cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleRubAndPlay}
          fill="url(#goldGradient)"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>
          <path d="M432,176c-17.7,0-32,14.3-32,32v16c0,53-43,96-96,96H192v-32c0-8.8-7.2-16-16-16h-32c-35.3,0-64,28.7-64,64v12.4c-42.7,14.6-70.2,53.2-70.2,96.6c-4.5,0.7-9.1,1-13.8,1C14,446,14,478,14,478h484c0,0,0-32-82-32c-4.7,0-9.2-0.3-13.7-1c0-43.4-27.5-82-70.3-96.6V336c0-35.3-28.7-64-64-64h-32c-8.8,0-16,7.2-16,16v32h112c35.3,0,64-28.7,64-64v-16C396,202.5,412.1,176,432,176z M128,64c0,35.3,28.7,64,64,64h128c35.3,0,64-28.7,64-64s-28.7-64-64-64H192C156.7,0,128,28.7,128,64z"/>
          {/* Lid */}
          <path d="M288 16 C 288 8 224 8 224 16 L 224 48 L 288 48 Z" fill="#FCD34D"/>
        </svg>
      </div>

      <h1 className="font-display text-4xl text-amber-400 mb-4 drop-shadow-md z-10">
        Il Genio
      </h1>
      
      <p className="font-body text-indigo-100 text-lg mb-8 max-w-xs z-10">
        Avvicinati e sfregala per risvegliare fenomenali poteri cosmici!
      </p>

      <button
        onClick={handleRubAndPlay}
        className="z-10 bg-amber-500 hover:bg-amber-400 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform active:scale-95 animate-pulse"
      >
        SFREGA LA LAMPADA ✨
      </button>
    </div>
  );
};

export default LampTrigger;