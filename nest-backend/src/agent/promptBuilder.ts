export function buildPrompt(minimal: any) {
  return `You are scoring a pull request for reward eligibility.\n\nPR:\n${JSON.stringify(minimal.pr)}\n\nChanges:\n${minimal.changes
    .map(
      (c: any) => `File: ${c.file}\n+${c.add} -${c.del}\nPatch:\n${c.patch}`
    )
    .join("\n\n")}\n\nTask:\n- Analyze complexity, impact, urgency, and effort.\n- Output strictly JSON only: \n{\n  \"tier\": \"low\" | \"medium\" | \"high\",\n  \"label\": \"reward-low\" | \"reward-medium\" | \"reward-high\",\n  \"comment\": \"human-readable explanation\"\n}`;
}