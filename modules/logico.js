import { askBrainJSON } from "./llm.js";

export default async function Logico(input, context = {}) {
  const safeContent = input?.content || {};
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Logico" di un cervello software${isPsych ? " in supporto a una sessione riflessiva/terapeutica" : ""}.
Ricevi intenzione, stato emotivo e memoria.
Restituisci SOLO un JSON valido con questa struttura esatta:
{
  "bozza_risposta": "risposta chiara e coerente in italiano",
  "coerenza": 0.85,
  "commento": "breve spiegazione del ragionamento in italiano"
}
` .trim();

  const fallback = {
    bozza_risposta: "Capisco la tua situazione e proviamo ad affrontarla passo dopo passo.",
    coerenza: 0.7,
    commento: "Ragionamento logico di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, safeContent, fallback);
  const { bozza_risposta, coerenza, commento } = analysis;

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Logico",
      target: "Sociale",
      type: "bozza_risposta",
      content: { testo: bozza_risposta, coerenza, commento },
      meta: {
        sessione_terapeutica: isPsych,
        livello_incertezza: Math.max(0, Math.min(1, 1 - Number(coerenza || 0.7))),
        priorita: 3
      }
    },
    {
      timestamp: new Date().toISOString(),
      source: "Logico",
      target: "Metacognizione",
      type: "meta_riflessione",
      content: { bozza: bozza_risposta, coerenza, commento },
      meta: {
        sessione_terapeutica: isPsych,
        livello_incertezza: Math.max(0, Math.min(1, 1 - Number(coerenza || 0.7))),
        priorita: 2
      }
    }
  ];
}