import { processInput } from "./brain.mjs"

async function runTest() {
  const result = await processInput("Mi sento agitato oggi", "psicologo")

  console.log("=== RISULTATO FINALE ===")
  console.log(result.risposta_finale)

  console.log("\n=== MESSAGGI INTERNI ===")
  console.log(JSON.stringify(result, null, 2))
}

runTest()
