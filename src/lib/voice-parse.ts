/** Heuristic parse for Web Speech results like "2500 teff" or "expense 400 transport". */
export function parseVoiceTransaction(text: string): {
  amount: number | null;
  product?: string;
  type: "sale" | "expense";
} {
  const lower = text.toLowerCase();
  const type: "sale" | "expense" = lower.includes("expense") || lower.includes("ወጪ")
    ? "expense"
    : "sale";
  const numMatch = text.match(/(\d[\d,\s]*\d|\d+)/);
  const amount = numMatch
    ? parseInt(numMatch[1].replace(/[\s,]/g, ""), 10)
    : null;
  let rest = text;
  if (numMatch) rest = rest.replace(numMatch[0], "");
  rest = rest.replace(/\b(expense|sale|ሽያጭ|ወጪ)\b/gi, "").trim();
  const product = rest.length > 0 ? rest : undefined;
  return { amount: Number.isFinite(amount) ? amount : null, product, type };
}
