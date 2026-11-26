import { askBrainJSON } from "./llm.js";

export default async function Memoria(input, context = {}) {
  const safeContent = input?.content || {};
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Memoria" di un cervello software${isPsych ? " in supporto a una sessione riflessiva/terapeutica" : ""}.
Ricevi una richiesta di memoria (es. obiettivo corrente, intenzione, stato emotivo).
Recupera ricordi plausibili o coerenti con il contesto e sintetizza un elemento utile.
Restituisci SOLO un JSON valido con questa struttura esatta:
{
  "ricordi": ["ricordo breve 1", "ricordo breve 2"],
  "contesto": "sintesi del contesto in italiano",
  "rilevanza": 0.75,
  "commento": "breve spiegazione in italiano"
}
` .trim();

  const fallback = {
    ricordi: ["nessun ricordo pregresso specifico disponibile"],
    contesto: "primo scambio o contesto iniziale senza storico persistente",
    rilevanza: 0.5,
    commento: "Recupero memoria di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, safeContent, fallback);
  const { ricordi, contesto, rilevanza, commento } = analysis;
  const relNum = Math.max(0, Math.min(1, Number(rilevanza ?? 0.5)));

  const baseContent = {
    ricordi: Array.isArray(ricordi) ? ricordi : [String(ricordi || "")].filter(Boolean),
    contesto,
    rilevanza: relNum,
    commento
  };

  const baseMeta = {
    sessione_terapeutica: isPsych,
    livello_incertezza: 1 - relNum,
    priorita: 2
  };

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Memoria",
      target: "Logico",
      type: "memoria_risposta",
      content: baseContent,
      meta: baseMeta
    },
    {
      timestamp: new Date().toISOString(),
      source: "Memoria",
      target: "Motivazionale",
      type: "memoria_supporto",
      content: baseContent,
      meta: { ...baseMeta, priorita: 3 }
    }
  ];
}