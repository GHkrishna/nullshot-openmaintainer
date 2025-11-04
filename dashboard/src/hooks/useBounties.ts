import { useState } from "react";
import initialData from "../data/bounties.json";
import { Bounty } from "../utils/types";
import { runMaintainerAgent } from "../agent/maintainerAgent";

export default function useBounties() {
  const [bounties, setBounties] = useState<Bounty[]>(initialData);
  const [loading, setLoading] = useState(false);

  const runAgent = async () => {
    setLoading(true);
    const updated = await runMaintainerAgent(bounties);
    setBounties(updated);
    setLoading(false);
  };

  return { bounties, runAgent, loading };
}
