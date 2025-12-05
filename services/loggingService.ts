/**
 * Service to log user interactions to an external repository (e.g., Google Sheets)
 * via a Web Hook.
 */

export const logInteraction = async (question: string, answer: string) => {
  const loggingUrl = process.env.LOGGING_ENDPOINT;

  // Debug log per confermare che l'URL è letto correttamente
  console.log(`[Logging] Tentativo di salvataggio su: ${loggingUrl}`);

  if (!loggingUrl) {
    console.warn("[Logging] Nessun URL configurato per il logging.");
    // Fail silently if no endpoint is configured (dev mode or not needed)
    return;
  }

  try {
    // We use 'no-cors' mode because Google Apps Scripts Web Apps don't send standard CORS headers
    // for simple POST requests from browsers. 'no-cors' means we can't read the response,
    // but the request will be sent.
    await fetch(loggingUrl, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain', // Use text/plain to avoid CORS preflight options request
      },
      body: JSON.stringify({ 
        question: question,
        answer: answer,
        // Send a readable local date string for the Excel file
        timestamp: new Date().toLocaleString('it-IT') 
      })
    });
    console.log("[Logging] Dati inviati correttamente (modalità no-cors). Controlla il foglio Google.");
  } catch (error) {
    // We simply log the error to console, but we don't disrupt the user experience
    console.warn("Could not log interaction to repository:", error);
  }
};