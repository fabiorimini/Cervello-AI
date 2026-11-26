import { askBrainJSON } from "./llm.js";

export default async function Sociale(logico, emotivo, motivazionale, context = {}) {
  const mode = context.mode || "normale";
  const isPsych = mode === "psicologo";

  const payload = {
    bozza: logico?.content || {},
    emotivo: emotivo?.content || {},
    motivazionale: motivazionale?.content || {},
    modalita: mode
  };

  const systemPrompt = `
Sei il modulo "Sociale" di un cervello software${isPsych ? " in modalità ascolto empatico e supportivo" : ""}.
Ricevi una bozza logica, uno stato emotivo, un obiettivo motivazionale e la modalità.
Formula una risposta finale naturale, calibrata sul tono e sull'emozione rilevata.
Restituisci SOLO un JSON valido con questa struttura esatta:
{
  "risposta_finale": "risposta rivolta all'utente in italiano",
  "tono": "calmo",
  "commento": "breve spiegazione in italiano"
}
` .trim();

  const fallback = {
    risposta_finale: logico?.content?.testo || "Capisco la tua situazione.",
    tono: "calmo",
    commento: "Sintesi sociale di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, payload, fallback);
  const { risposta_finale, tono, commento } = analysis;

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Sociale",
      target: "Output",
      type: "risposta_finale",
      content: { risposta: risposta_finale, tono, commento },
      meta: {
        sessione_terapeutica: isPsych,
        livello_incertezza: 0.1,
        priorita: 1
      }
    },
    {
      timestamp: new Date().toISOString(),
      source: "Sociale",
      target: "Memoria",
      type: "salvataggio_memoria",
      content: { ultima_risposta: risposta_finale },
      meta: {
        sessione_terapeutica: isPsych,
        livello_incertezza: 0.05,
        priorita: 2
      }
    }
  ];
}