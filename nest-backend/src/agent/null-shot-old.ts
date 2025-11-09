// import type AiSdkAgent from '@nullshot/agent/aisdk';
// import { XavaAgent, AgentEnv } from '@nullshot/agent';
// import { ToolboxService } from '@nullshot/agent/services';
// import { createOpenAI } from '@ai-sdk/openai';


// // Reward ranges from bounty.md
// const TIER_TO_REWARD = {
//   easy: { min: 50, max: 150, label: "reward-easy" },
//   medium: { min: 150, max: 300, label: "reward-medium" },
//   hard: { min: 300, max: 500, label: "reward-high" },
//   priority: { min: 500, max: 800, label: "reward-priority" }
// };

// export async function generateText(agent: any, text: string) {
//   const res = await agent.streamTextWithMessages(
//     "single-shot", 
//     [{ role: "user", content: text }],
//     {
//       maxSteps: 1
//     }
//   );

//   const final = await res.text(); // converts stream to full text
//   return final;
// }


// function pickReward(tier: string) {
//   const info = TIER_TO_REWARD[tier] || TIER_TO_REWARD.easy;
//   // choose midpoint to keep it deterministic and cheap
//   return Math.round((info.min + info.max) / 2);
// }

// // Compact score helper from your utilities
// export function scoreIssue(issue: any) {
//   let score = 100;
//   if (issue.urgency === "high") score += 80;
//   if (issue.docsAdded) score += 20;
//   if (issue.codeQuality === "excellent") score += 50;

//   const ageDays =
//     (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 3600 * 24);
//   if (ageDays > 20) score += 30;

//   return Math.round(score);
// }

// // Compact PR analysis builder
// export function buildPRPrompt(minimal: any) {
//   return (
//     "PR:" +
//     JSON.stringify(minimal.pr) +
//     "\nChanges:\n" +
//     minimal.changes
//       .map(
//         (c: any) =>
//           `File:${c.file} +${c.add} -${c.del}\nPatch:${c.patch?.slice(0, 400)}`
//       )
//       .join("\n\n")
//   );
// }

// // Main evaluator
// export async function evaluatePRReward(env: any, minimal: any) {
//   const issueScore = scoreIssue(minimal.pr);
//   const prSnippet = buildPRPrompt(minimal);

//   // Short, token-cheap scoring prompt using your bounty.md criteria
//   const prompt = `
// Evaluate a PR for bounty rewards using these factors:
// complexity, impact, clarity, timeliness, issue age, and review quality.

// Score:${issueScore}

// PR summary:
// ${prSnippet}

// Respond ONLY valid JSON:
// {
//   "tier": "easy" | "medium" | "hard" | "priority",
//   "comment": "brief human explanation"
// }
//   `.trim();

//   // const result = await runPrompt({
//   //   env,
//   //   messages: [{ role: "user", content: prompt }],
//   //   maxTokens: 180,
//   //   temperature: 0.2
//   // });

//   const result = await generateText(this.agent, prompt);


//   let json;
//   try {
//     json = JSON.parse(result.text.trim());
//   } catch {
//     json = {
//       tier: "easy",
//       comment: "Valid but simple contribution. Fallback applied."
//     };
//   }

//   const reward = pickReward(json.tier);
//   const label = TIER_TO_REWARD[json.tier]?.label ?? "reward-easy";

//   return {
//     tier: json.tier,
//     label,
//     reward,
//     comment: json.comment
//   };
// }
