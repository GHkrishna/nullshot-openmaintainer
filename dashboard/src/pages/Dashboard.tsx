import React from "react";
import BountyList from "../components/BountyList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-center text-2xl font-semibold">
        🧠 OpenMaintainer Dashboard
      </header>
      <BountyList />
    </div>
  );
}
