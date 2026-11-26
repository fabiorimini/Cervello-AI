import { askBrainJSON } from "./llm.js";

export default async function Motivazionale(input, context = {}) {
  const safeContent = input?.content || {};
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Motivazionale" di un cervello software${isPsych ? " in supporto a una sessione attenta al benessere emotivo" : ""}.
Ricevi urgenza, stato emotivo o riflessioni. Decidi l'obiettivo motivazionale e valuta se serve un allarme di sopravvivenza.
Restituisci SOLO un JSON valido con questa struttura esatta:
{
  "obiettivo": "stringa",
  "livello_motivazione": 0.7,
  "allarme_sopravvivenza": false,
  "commento": "breve spiegazione in italiano"
}
` .trim();

  const fallback = {
    obiettivo: "rispondere",
    livello_motivazione: 0.6,
    allarme_sopravvivenza: false,
    commento: "Valutazione motivazionale di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, safeContent, fallback);
  const { obiettivo, livello_motivazione, allarme_sopravvivenza, commento } = analysis;

  const baseMeta = {
    sessione_terapeutica: isPsych,
    livello_incertezza: 0.2,
    priorita: 2
  };

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Motivazionale",
      target: "Sociale",
      type: "obiettivo",
      content: { obiettivo, livello_motivazione, commento },
      meta: baseMeta
    },
    {
      timestamp: new Date().toISOString(),
      source: "Motivazionale",
      target: "Emotivo",
      type: "allarme_sopravvivenza",
      content: { attivo: Boolean(allarme_sopravvivenza), commento },
      meta: { ...baseMeta, livello_incertezza: 0.1, priorita: 1 }
    },
    {
      timestamp: new Date().toISOString(),
      source: "Motivazionale",
      target: "Memoria",
      type: "richiesta_memoria",
      content: { obiettivo_corrente: obiettivo },
      meta: { ...baseMeta, livello_incertezza: 0.3, priorita: 3 }
    }
  ];
}