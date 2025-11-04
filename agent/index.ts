import { distributeRewards } from "./distributor";

export function runVirtualMaintainerAgent() {
  console.log("🤖 Running OSS Virtual Maintainer Agent...");
  const txs = distributeRewards();

  console.table(txs.map(t => ({
    PR: t.prId,
    Contributor: t.contributor,
    Reward: t.reward,
    TxHash: t.txHash,
  })));

  return txs;
}
