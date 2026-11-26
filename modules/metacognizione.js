import { askBrainJSON } from "./llm.js";

export default async function Metacognizione(input, context = {}) {
  const safeContent = input?.content || {};
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Metacognizione" di un cervello software${isPsych ? " in supporto a una sessione riflessiva/terapeutica" : ""}.
Ricevi bozza logica, stato emotivo o obiettivo motivazionale.
Valuta la coerenza e rileva eventuali conflitti o incoerenze.
Restituisci SOLO un JSON valido con questa struttura esatta:
{
  "livello_coerenza": 0.8,
  "conflitti": ["eventuale conflitto 1"],
  "suggerimento": "suggerimento pratico in italiano",
  "commento": "breve spiegazione in italiano"
}
` .trim();

  const fallback = {
    livello_coerenza: 0.7,
    conflitti: [],
    suggerimento: "La risposta è accettabile e coerente.",
    commento: "Valutazione metacognitiva di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, safeContent, fallback);
  const { livello_coerenza, conflitti, suggerimento, commento } = analysis;
  const cohNum = Math.max(0, Math.min(1, Number(livello_coerenza ?? 0.7)));
  const conflictsArr = Array.isArray(conflitti)
    ? conflitti
    : [String(conflitti || "")].filter(Boolean);

  const meta = {
    sessione_terapeutica: isPsych,
    livello_incertezza: 1 - cohNum,
    priorita: 2
  };

  return [
    {
      timestamp: new Date().toISOString(),
      source: "Metacognizione",
      target: "Logico",
      type: "richiesta_chiarezza",
      content: { conflitti: conflictsArr, suggerimento, commento },
      meta
    },
    {
      timestamp: new Date().toISOString(),
      source: "Metacognizione",
      target: "Tutti",
      type: "meta_riflessione",
      content: {
        livello_coerenza: cohNum,
        conflitti: conflictsArr,
        suggerimento,
        commento
      },
      meta: { ...meta, priorita: 1 }
    }
  ];
}