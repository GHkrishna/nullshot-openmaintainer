import React from "react";
import { Bounty } from "../utils/types";
import BountyStatusBadge from "./BountyStatus";
import TxHashLink from "./TxHashLink";
import BountyEvaluation from "./BountyEvaluation";


interface Props {
  bounty: Bounty;
}

export default function BountyCard({ bounty }: Props) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
      <h2 className="text-lg font-semibold mb-1">
        <a href={bounty.issue.url} target="_blank" className="text-blue-600">
          {bounty.issue.title}
        </a>
      </h2>

      <p className="text-sm text-gray-600 mb-2">
        by{" "}
        <a
          href={bounty.pullRequest.url}
          target="_blank"
          className="font-medium text-gray-800"
        >
          @{bounty.pullRequest.author}
        </a>
      </p>

      <div className="flex justify-between items-center text-sm">
        <BountyStatusBadge status={bounty.status} />
        <span className="font-mono">{bounty.reward} ETH</span>
      </div>

      {bounty.txHash && <TxHashLink txHash={bounty.txHash} />}
      {bounty.evaluations && <BountyEvaluation evaluation={bounty.evaluations} />}

    </div>
  );
}
