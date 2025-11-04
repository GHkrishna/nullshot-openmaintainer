import { evaluatePRs } from "./evaluator";
import { mockPRs } from "./mockData";

export function distributeRewards() {
  const evaluations = evaluatePRs();

  const txs = evaluations.map((evalResult) => {
    const pr = mockPRs.find((p) => p.id === evalResult.prId)!;

    const txHash =
      "0x" + Math.random().toString(16).substring(2, 10).toUpperCase();

    pr.tags = ["reward_distributed"];

    return {
      prId: pr.id,
      contributor: pr.contributor,
      reward: evalResult.rewardSuggested,
      txHash,
      comments: evalResult.comments,
    };
  });

  return txs;
}
