import React from "react";
import BountyCard from "../components/BountyCard";
import useBounties from "../hooks/useBounties";

export default function Dashboard() {
  const { bounties, runAgent, loading } = useBounties();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-center text-2xl font-semibold">
        🧠 OpenMaintainer Dashboard
      </header>

      <div className="flex justify-center mt-4">
        <button
          onClick={runAgent}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Running Agent..." : "Run AI Agent"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
        {bounties.map((bounty) => (
          <BountyCard key={bounty.id} bounty={bounty} />
        ))}
      </div>
    </div>
  );
}
