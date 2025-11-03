import React from "react";

interface Props {
  txHash: string;
  network?: string; // e.g., 'sepolia', 'mainnet', etc.
}

export default function TxHashLink({ txHash, network = "sepolia" }: Props) {
  if (!txHash) return null;

  const explorerUrl = `https://${network}.etherscan.io/tx/${txHash}`;

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-blue-500 hover:underline mt-2 inline-block"
    >
      View on block explorer ↗
    </a>
  );
}
