import { mockPRs } from "./mockData";

export type EvaluationResult = {
  prId: number;
  effortScore: number;
  rewardSuggested: number;
  comments: string;
};

export function evaluatePRs() {
  const results: EvaluationResult[] = [];

  for (const pr of mockPRs) {
    const daysOpen =
      (new Date(pr.mergedAt).getTime() - new Date(pr.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    let effortScore = 50; // base score

    if (pr.issuePriority === "high") effortScore += 20;
    if (daysOpen > 20) effortScore += 10;
    if (pr.title.toLowerCase().includes("fix")) effortScore += 10;
    if (pr.title.toLowerCase().includes("doc")) effortScore -= 10;

    const [minReward, maxReward] = pr.rewardRange;
    const rewardSuggested =
      Math.min(
        maxReward,
        Math.round(minReward + (effortScore / 100) * (maxReward - minReward))
      ) || minReward;

    results.push({
      prId: pr.id,
      effortScore,
      rewardSuggested,
      comments: `PR "${pr.title}" evaluated with effort score ${effortScore}.`,
    });
  }

  return results;
}
