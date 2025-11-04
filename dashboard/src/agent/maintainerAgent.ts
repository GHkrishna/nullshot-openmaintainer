import { Bounty } from "../utils/types";
import { calculateEffortScore } from "../utils/scoring";

export async function runMaintainerAgent(bounties: Bounty[]): Promise<Bounty[]> {
  // Simulate async agent run
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = bounties.map((bounty) => {
        // Skip if already rewarded
        if (bounty.status === "reward_distributed") return bounty;

        // Evaluate new metrics
        const evaluation = calculateEffortScore(bounty);

        // Decide next status
        let status = "in_progress";
        if (bounty.pullRequest.merged) {
          status = "completed";
        }

        // Decide reward based on score
        const baseReward = 0.05;
        const reward = baseReward + evaluation.total * 0.05; // scale up slightly

        // Simulate txHash if reward distributed
        const txHash =
          status === "completed"
            ? "0x" + Math.floor(Math.random() * 1e16).toString(16)
            : undefined;

        return {
          ...bounty,
          evaluations: evaluation.details,
          status: status === "completed" ? "reward_distributed" : status,
          reward: parseFloat(reward.toFixed(3)),
          txHash,
        };
      });

      resolve(updated);
    }, 1500);
  });
}
