import Percezione from "./modules/percezione.js";
import Emotivo from "./modules/emotivo.js";
import Logico from "./modules/logico.js";
import Sociale from "./modules/sociale.js";
import Motivazionale from "./modules/motivazionale.js";
import Memoria from "./modules/memoria.js";
import Metacognizione from "./modules/metacognizione.js";

export async function processInput(userMessage, mode = "normale") {
  const context = { mode };

  // 1. Percezione
  const percezioneMsgs = await Percezione(userMessage, context);

  // 2. Emotivo
  const emotivoMsgs = await Emotivo(percezioneMsgs[0], context);

  // 3. Motivazionale
  const motivazionaleMsgs = await Motivazionale(percezioneMsgs[2], context);

  // 4. Memoria
  const memoriaMsgs = await Memoria(motivazionaleMsgs[2], context);

  // 5. Logico
  const logicoMsgs = await Logico(
    {
      content: {
        intenzione: percezioneMsgs[1]?.content?.intenzione,
        stato_emotivo: emotivoMsgs[0]?.content,
        memoria: memoriaMsgs[0]?.content
      }
    },
    context
  );

  // 6. Metacognizione
  const metacognizioneMsgs = await Metacognizione(logicoMsgs[1], context);

  // 7. Sociale (riceve anche la meta-riflessione)
  const socialeMsgs = await Sociale(
    logicoMsgs[0],
    emotivoMsgs[1],
    motivazionaleMsgs[0],
    context,
    metacognizioneMsgs[1]
  );

  return {
    percezione: percezioneMsgs,
    emotivo: emotivoMsgs,
    motivazionale: motivazionaleMsgs,
    memoria: memoriaMsgs,
    logico: logicoMsgs,
    metacognizione: metacognizioneMsgs,
    sociale: socialeMsgs,
    risposta_finale: socialeMsgs?.[0]?.content?.risposta || ""
  };
}