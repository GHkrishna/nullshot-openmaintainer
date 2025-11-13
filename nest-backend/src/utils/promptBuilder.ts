export function buildPrompt(minimal: any) {
  return `You are scoring a pull request for reward eligibility.\n\nPR:\n${JSON.stringify(minimal.pr)}\n\nChanges:\n${minimal.changes
    .map(
      (c: any) => `File: ${c.file}\n+${c.add} -${c.del}\nPatch:\n${c.patch}`
    )
    .join("\n\n")}\n\nTask:\n- Analyze complexity, impact, urgency, and effort.\n- Output strictly JSON only: \n{\n  \"tier\": \"low\" | \"medium\" | \"high\",\n  \"label\": \"reward-low\" | \"reward-medium\" | \"reward-high\",\n  \"comment\": \"human-readable explanation\"\n}`;
}

export function updatedBuildPrompt(minimal: any, pr: string, rewardRange: string) {
  return `You are an AI agent scoring a pull request for bounty rewards.

PR:
${JSON.stringify(pr)}

Suggested reward range:
${rewardRange}

Changes:
${minimal}

Evaluate by:
- Complexity: files, lines, depth.
- Impact: usefulness, alignment with project.
- Quality: readability, docs, style.
- Timeliness: speed vs issue age.
- Priority: high/legacy bonus.
- Feedback: reviews incorporated.

Reward tiers:
🟢 Easy 50–150
🟠 Medium 150–300
🔵 Hard 300–500
🔴 Priority 500–800

Output only JSON, nothing else, not even a single text, strictly JSON only:
{
  "suggestedReward": number,
  "comment": "short reason"
}`;
}
