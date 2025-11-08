export async function tokenCalc(prompt: string) {
  const { encoding_for_model } = await import("@dqbd/tiktoken");
  const enc = encoding_for_model("gpt-4o"); 
  const tokens = enc.encode(prompt);
  enc.free();
  return tokens.length;
}
