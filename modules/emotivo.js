import { askBrainJSON } from "./llm.js";

export default async function Emotivo(input, context = {}) {
  const safeContent = input?.content || {};
  const isPsych = context.mode === "psicologo";

  const systemPrompt = `
Sei il modulo "Emotivo" di un cervello software${isPsych ? " in modalità ascolto empatico/terapeutico" : ""}.
Analizza l'input e restituisci SOLO un JSON valido con questa struttura esatta:
{
  "emozione": "stringa",
  "intensita": 0.5,
  "modulazione": 0.4,
  "commento": "breve spiegazione in italiano"
}
` .trim();

  const fallback = {
    emozione: safeContent.emozione || "neutrale",
    intensita: Number(safeContent.intensita ?? 0.2),
    modulazione: Number(safeContent.intensita ?? 0.2) * 0.8,
    commento: "Analisi emotiva di fallback"
  };

  const analysis = await askBrainJSON(systemPrompt, safeContent, fallback);
  const { emozione, intensita, modulazione, commento } = analysis;

  const baseMsg = {
    timestamp: new Date().toISOString(),
    source: "Emotivo",
    type: "stato_emotivo",
    content: { emozione, intensita, modulazione, commento },
    meta: {
      sessione_terapeutica: isPsych,
      livello_incertezza: 0.15,
      priorita: 2
    }
  };

  return [
    { ...baseMsg, target: "Logico" },
    { ...baseMsg, target: "Sociale" }
  ];
}