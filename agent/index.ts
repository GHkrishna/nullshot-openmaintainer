import fs from "fs";
import path from "path";
import { scoreIssue } from "./utils/scoring.js";

const issues = [
  {
    id: 1,
    title: "Fix CI pipeline",
    createdAt: "2025-10-10",
    urgency: "high",
    contributor: "@bob",
    docsAdded: true,
    codeQuality: "good",
  },
  {
    id: 2,
    title: "Add README section for setup",
    createdAt: "2025-09-15",
    urgency: "medium",
    contributor: "@alice",
    docsAdded: true,
    codeQuality: "excellent",
  },
];

const output = issues.map((issue) => ({
  ...issue,
  suggestedBounty: scoreIssue(issue),
}));

const outputPath = path.join("agent", "data", "sample.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log("✅ Suggested bounty data written to:", outputPath);
