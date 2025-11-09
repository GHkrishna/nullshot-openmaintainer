// TODO: For now we can skip the webhook part and instead make the AI reviews and decides reward from API call

import express from "express";
import { Webhooks } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";
import { minimalExtractor } from "./git-extractor";
import { buildPrompt } from "./promptBuilder";

const app = express();
const port = process.env.PORT || 5000;

// Initialize webhook handler
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

// Attach raw body for webhook verification
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  })
);
// Handle PR events
webhooks.on("pull_request", async ({ payload }) => {
  const action = payload.action;
  if (!["opened", "reopened", "synchronize"].includes(action)) return;

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const pull_number = payload.pull_request.number;

  const octokit = new Octokit({ auth: process.env.GITHUB_FINEGRAINED_TOKEN! });

  // Fetch PR + Files
  const [pr, files] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number }).then((r) => r.data),
    octokit.pulls.listFiles({ owner, repo, pull_number }).then((r) => r.data),
  ]);

  const minimal = minimalExtractor(pr, files);
  const prompt = buildPrompt(minimal);

  // Call AI model (placeholder)
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  }).then((res) => res.json());

  const result = JSON.parse(aiResponse.choices[0].message.content);

  // Update label
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: pull_number,
    labels: [result.label],
  });

  // Add PR comment
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: result.comment,
  });

  console.log(`Processed PR #${pull_number}`);
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => console.log(`Webhook server running on port ${port}`));