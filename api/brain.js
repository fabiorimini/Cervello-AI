import { processInput } from "../brain.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito. Usa POST." });
  }

  try {
    const { message, mode = "normale" } = req.body || {};
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Il campo 'message' è obbligatorio." });
    }

    const result = await processInput(message.trim(), mode);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Errore in /api/brain:", err);
    return res.status(500).json({
      error: "Errore durante l'elaborazione del cervello AI",
      details: err.message
    });
  }
}