import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili dal file .env se presente
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Abbiamo rimosso process.env.API_KEY da qui. 
      // Vite non lo "scriverà" più nel file JS finale, rendendolo invisibile all'esterno.
      
      // Manteniamo solo l'endpoint di logging per le statistiche del foglio Google
      'process.env.LOGGING_ENDPOINT': JSON.stringify(env.LOGGING_ENDPOINT || process.env.LOGGING_ENDPOINT || "")
    }
  }
})