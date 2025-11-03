import React from "react";
import { BountyStatus } from "../utils/types";

interface Props {
  status: BountyStatus;
}

const statusColors: Record<BountyStatus, string> = {
  open: "bg-gray-400 text-white",
  in_progress: "bg-yellow-500 text-white",
  completed: "bg-blue-600 text-white",
  reward_pending: "bg-purple-600 text-white",
  reward_distributed: "bg-green-600 text-white",
};

export default function BountyStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
