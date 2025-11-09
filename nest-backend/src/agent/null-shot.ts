// import { Hono } from 'hono';
// import  { applyPermissionlessAgentSessionRouter } from '@nullshot/agent'
// import  AiSdkAgent from '@nullshot/agent'
// import { AIUISDKMessage, Service }  from '@nullshot/agent';
// import { ToolboxService } from '@nullshot/agent/services';
// import { LanguageModel } from 'ai';
// import { stepCountIs } from 'ai';
// import { buildPrompt } from '../utils/not-sure/promptBuilder'; // your buildPrompt utility
// import { scoreIssue } from '../utils/scoring'; // your scoreIssue utility
// import mcpConfig from '../mcp.json';

// // Define the environment type
// export type MyEnv = {
//   OPENAI_API_KEY?: string;
// } & Env; // Extend with your Env bindings

// // The agent class
// export class PRRewardAgent extends AiSdkAgent<MyEnv> {
//   constructor(state: DurableObjectState, env: MyEnv) {
//     // Initialize the AI provider (OpenAI as example)
//     const model: LanguageModel = require('@ai-sdk/openai').createOpenAI({ apiKey: env.OPENAI_API_KEY })('gpt-3.5-turbo');

//     // Initialize services
//     const services: Service[] = [new ToolboxService(env, mcpConfig)];

//     super(state, env, model, services);
//   }

//   // Process a PR for feedback and reward
//   async processPR(sessionId: string, prMinimal: any): Promise<{ label: string; comment: string }> {
//     // Build the prompt for minimal token usage
//     const prompt = buildPrompt(prMinimal);

//     const result = await this.streamTextWithMessages(sessionId, [
//       {
//         role: 'user',
//         content: prompt
//       }
//     ], {
//       system: 'You are a concise AI reviewer for PR rewards. Use minimal tokens.',
//       maxSteps: 5, // small steps for efficiency
//       stopWhen: stepCountIs(5),
//       experimental_toolCallStreaming: true,
//       onError: (err) => console.error('PR processing error:', err)
//     });

//     // Convert streamed response to JSON
//     const responseText = await result.toString(); // result is AIUISDKResult
//     let json: any;
//     try {
//       json = JSON.parse(responseText);
//     } catch (err) {
//       console.error('Failed to parse AI JSON response:', responseText);
//       json = { tier: 'low', label: 'reward-low', comment: 'Failed to analyze PR, defaulting to low.' };
//     }

//     return {
//       label: json.label,
//       comment: json.comment
//     };
//   }

//   // Score a PR locally as a fallback
//   fallbackScore(pr: any) {
//     const score = scoreIssue(pr);
//     if (score > 400) return 'reward-high';
//     if (score > 200) return 'reward-medium';
//     return 'reward-low';
//   }
// }

// // Setup Hono app and router
// const app = new Hono<{ Bindings: MyEnv }>();
// applyPermissionlessAgentSessionRouter(app);

// export default {
//   async fetch(req: Request, env: MyEnv, ctx: ExecutionContext) {
//     return app.fetch(req, env, ctx);
//   }
// };
