import React from "react";
import bounties from "../data/bounties.json";
import BountyCard from "./BountyCard";

export default function BountyList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      {bounties.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}
