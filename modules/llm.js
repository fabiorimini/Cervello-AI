import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askBrainJSON(systemPrompt, payload, fallbackObj) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: typeof payload === "string" ? payload : JSON.stringify(payload)
        }
      ]
    });

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) {
      console.error("OpenAI ha restituito content vuoto:", JSON.stringify(completion));
      return fallbackObj;
    }

    const parsed = JSON.parse(raw);
    return { ...fallbackObj, ...parsed };
  } catch (err) {
    console.error("Fallback attivato in askBrainJSON:", err?.message || err);
    return fallbackObj;
  }
}
