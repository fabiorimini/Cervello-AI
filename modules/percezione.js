import { askBrainJSON } from "./llm.js";

export default async function Percezione(userMessage, context = {}) {
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Percezione" di un cervello software${isPsych ? " in modalità ascolto attento e sensibile alle sfumature emotive" : ""}.
Analizza il messaggio dell'utente e restituisci SOLO un JSON valido con questa struttura esatta:
{
  "emozione": "stringa",
  "intensita": 0.3,
  "intenzione": "stringa",
  "ambiguita": 0.2,
  "urgenza": 0.4
}
` .trim();

  const fallback = {
    emozione: "neutrale",
    intensita: 0.1,
    intenzione: "intenzione_generica",
    ambiguita: 0.5,
    urgenza: 0.3
  };

  const analysis = await askBrainJSON(systemPrompt, userMessage, fallback);
  const { emozione, intensita, intenzione, ambiguita, urgenza } = analysis;

  const meta = {
    sessione_terapeutica: isPsych,
    livello_incertezza: Number(ambiguita ?? 0.5),
    priorita: 2
  };

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Percezione",
      target: "Emotivo",
      type: "emozione_percepita",
      content: { emozione, intensita },
      meta
    },
    {
      timestamp: new Date().toISOString(),
      source: "Percezione",
      target: "Logico",
      type: "intenzione",
      content: { intenzione },
      meta
    },
    {
      timestamp: new Date().toISOString(),
      source: "Percezione",
      target: "Motivazionale",
      type: "urgenza",
      content: { livello: urgenza },
      meta: { ...meta, priorita: 3 }
    }
  ];
}