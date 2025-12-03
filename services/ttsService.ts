
export const speakGenie = (text: string) => {
  if (!window.speechSynthesis) return;

  // Interrompi eventuali parlati precedenti
  window.speechSynthesis.cancel();

  // Pulisci il testo da simboli di formattazione ed emoji per una lettura fluida
  const cleanText = text
    .replace(/\*/g, '') // Rimuove asterischi
    .replace(/POOOOF!/g, '') // Rimuove suoni onomatopeici
    .replace(/[✨🧞‍♂️🔮💨]/g, '') // Rimuove emoji
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'it-IT';
  
  // Ottieni le voci disponibili
  const voices = window.speechSynthesis.getVoices();
  const itVoices = voices.filter(v => v.lang.includes('it'));

  // Logica di selezione voce prioritaria per ottenere un timbro maschile
  // 1. Cerca voci maschili conosciute (Windows/iOS/Android)
  let selectedVoice = itVoices.find(v => 
    v.name.includes('Cosimo') || // Windows
    v.name.includes('Luca') ||   // iOS
    v.name.includes('Adriano') || 
    v.name.toLowerCase().includes('male') // Generic Male identifier
  );

  // 2. Se non trova maschile specifico, cerca Google Italiano (solitamente alta qualità, anche se spesso femminile)
  if (!selectedVoice) {
    selectedVoice = itVoices.find(v => v.name.includes('Google'));
  }

  // 3. Fallback sulla prima voce italiana disponibile
  if (!selectedVoice && itVoices.length > 0) {
    selectedVoice = itVoices[0];
  }

  // Applicazione della voce e regolazione parametri
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    
    // Se abbiamo trovato una voce esplicitamente maschile, usiamo un tono naturale.
    // Se stiamo usando una voce generica (che potrebbe essere femminile), abbassiamo il pitch
    // per renderla maschile e "calda" (accogliente).
    const isExplicitlyMale = selectedVoice.name.includes('Cosimo') || selectedVoice.name.includes('Luca') || selectedVoice.name.toLowerCase().includes('male');
    
    if (isExplicitlyMale) {
        utterance.pitch = 1.0; // Naturale
    } else {
        utterance.pitch = 0.9; // Leggermente più basso per calore e mascolinità, ma non robotico (0.8 era troppo basso)
    }
  }

  // Velocità: 1.05 per essere vivace ma chiaro e comprensibile
  utterance.rate = 1.05; 
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

export const stopGenieSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Listener per il caricamento asincrono delle voci (necessario per Chrome/Android)
if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Forza un refresh delle voci in background
        window.speechSynthesis.getVoices();
    };
}
