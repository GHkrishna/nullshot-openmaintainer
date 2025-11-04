import { Bounty } from "./types";
import { WEIGHTS } from "./constants";

export function calculateEffortScore(bounty: Bounty) {
  const details = {
    complexity: Math.random() * 0.4 + 0.6,
    documentation: Math.random() * 0.3 + 0.7,
    codeQuality: Math.random() * 0.4 + 0.6,
  };

  // Apply additional weight based on issue age or urgency
  const priorityBoost = bounty.issue.title.toLowerCase().includes("urgent") ? 0.1 : 0;
  const total =
    details.complexity * WEIGHTS.complexity +
    details.documentation * WEIGHTS.documentation +
    details.codeQuality * WEIGHTS.codeQuality +
    priorityBoost;

  return {
    total: Math.min(total, 1),
    details,
  };
}
