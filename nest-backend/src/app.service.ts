import { Injectable } from '@nestjs/common';
// import { getPR } from './utils/not-sure/github-client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { extractAddressFromBody, extractPRs } from './utils/git-extractor';
import { AgentClient } from './agent/agent';
import { OnChainTransaction } from './on-chain/on-chain';
import { AgentChatResponse, ChatMessage, Labels } from './utils/interface';
import { updatedBuildPrompt } from './utils/promptBuilder';
import { getRewardRangeByLabel } from './utils/scoring';

@Injectable()
export class AppService {
  // TODO: I'm thinking if I should have a DB for now, something like neon db should be fine wid prisma, lets see


  private readonly baseUrl = 'https://api.github.com';
  private readonly agentBaseUrl = 'http://localhost:8787';
  private readonly token = process.env.GITHUB_FINEGRAINED_TOKEN;
  private readonly ownerAccount = process.env.OWNER_ACCOUNT_ADDRESS!;
  private readonly tokenName = process.env.TOKEN_NAME_MONAD!;
  private readonly tokenSymbol = process.env.TOKEN_SYMBOL_MONAD!;
  private client: AgentClient;
  private onChainInteraction: OnChainTransaction;


  constructor(private readonly http: HttpService) {
    this.client = new AgentClient("http://localhost:8787");
    this.onChainInteraction = new OnChainTransaction()
  }
  getHello(): string {
    return 'Hello World!';
  }

  // getPR(): any {
  //   return getPR('GHkrishna', 'nullshot-openmaintainer', 1);
  // }

  async getForGithub<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log("[DEBUG][GET] URL:", url);
    console.log("[DEBUG][GET] Token:", this.token);

    const response = await firstValueFrom(
      this.http.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Connection: 'keep-alive',
          Accept: 'application/vnd.github.v3+json',
          ...headers,
        },
      }),
    );

    console.log("[DEBUG][GET] Response:", response?.data);
    return response?.data;
  }

  // Generic POST with debug logs
  async postForGithub<T = any>(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log("[DEBUG][POST] URL:", url);
    console.log("[DEBUG][POST] Body:", body);
    console.log("[DEBUG][POST] Token:", this.token);

    const response = await firstValueFrom(
      this.http.post(url, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Connection: 'keep-alive',
          Accept: 'application/vnd.github.v3+json',
          ...headers,
        },
      }),
    );

    console.log("[DEBUG][POST] Response:", response?.data);
    return response.data;
  }

  // Generic POST with debug logs
  async postraw<T = any>(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.agentBaseUrl}${endpoint}`;

    console.log("[DEBUG][POST] URL:", url);
    console.log("[DEBUG][POST] Body:", body);
    console.log("[DEBUG][POST] Token:", this.token);

    const response = await firstValueFrom(
      this.http.post(url, body, {
        headers: {
          Connection: 'keep-alive',
          ...headers,
        },
      }),
    );

    console.log("[DEBUG][POST] Response:", response?.data);
    return response.data;
  }
  // Fetch PR list for a repo
  async getPullRequests(owner: string, repo: string, pr?: number) {
    console.log("[DEBUG] Fetching PRs for:", owner, repo);
    const url = pr ? `/repos/${owner}/${repo}/pulls/${pr}` : `/repos/${owner}/${repo}/pulls`
    let response = await this.getForGithub(url);

    if (response.length == 0)
      return []

    if (!Array.isArray(response))
      response = new Array(response)
    const prs = extractPRs(response);
    console.log("[DEBUG] Extracted PRs:", prs);
    return prs;
  }

  // Fetch PR diff/files
  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<any[]> {
    console.log("[DEBUG] Fetching PR files for:", owner, repo, prNumber);
    return this.getForGithub(`/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
      Accept: 'application/vnd.github.v3.diff',
    });
  }

  // Add "Rewarded" label
  async addRewardedLabelToPR(owner: string, repo: string, prNumber: number) {
    console.log("[DEBUG] Adding 'Rewarded' label to PR:", prNumber);
    return this.postForGithub(
      `/repos/${owner}/${repo}/issues/${prNumber}/labels`,
      { labels: ["Rewarded"] }
    );
  }

  // Add custom labels
  async addLabelToPR(owner: string, repo: string, prNumber: number, labels: string[]) {
    console.log("[DEBUG] Adding labels to PR:", prNumber, "Labels:", labels);
    return this.postForGithub(
      `/repos/${owner}/${repo}/issues/${prNumber}/labels`,
      { labels: [...labels] }
    );
  }

  // Add comment to PR
  async addCommentToPR(owner: string, repo: string, prNumber: number, body: string) {
    console.log("[DEBUG] Adding comment to PR:", prNumber, "Body:", body);
    return this.postForGithub(
      `/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      { body }
    );
  }

  // Reward PR flow
  async rewardPR(owner: string, repo: string, prNumber: number) {
    try {
      // TODO: Do some sanity checks, like: 
      // 1. Is the PR actually ready(label: "Ready for reward"), 
      // 2. If its not already rewarded, etc 

      console.log("[DEBUG] Rewarding PR:", prNumber);
      await this.addRewardedLabelToPR(owner, repo, prNumber);
      console.log("[DEBUG] Rewarded label added");

      const result = await this.doAllAIAndBlockchainStuff(owner, repo, prNumber)

      // 3. Take comment from agent
      // await this.addCommentToPR(owner, repo, prNumber, "Rewarded to the contributor successfully");
      // console.log("[DEBUG] Comment added to PR");

      // // 4.0. Extract address from PR description
      // // 4. Distribute reward
      // await this.distributeReward("address")
      return result;
    } catch (err) {
      console.log("Error occurred")
    }
  }
  async distributeReward(address: string) {
    // All the ochain interaction , I'll need to sdd here
    throw new Error('Method not implemented.');
  }

  async doAllAIAndBlockchainStuff(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<string> {
    console.log(`[DEBUG][START] Running doAllAIAndBlockchainStuff for ${owner}/${repo}#${prNumber}`);

    try {
      console.log(`[DEBUG] Fetching PR details...`);
      const prDetails = await this.getPullRequests(owner, repo, prNumber);
      console.log(`[DEBUG] PR details fetched:`, JSON.stringify(prDetails, null, 2));

      console.log(`[DEBUG] Fetching PR file details...`);
      const fileDetails = await this.getPullRequestFiles(owner, repo, prNumber);
      console.log(`[DEBUG] File details fetched: ${fileDetails.length} files`);

      console.log(`[DEBUG] Checking PR validity...`);
      const isValid = await this.checkPRValidity(prDetails);
      console.log(`[DEBUG] PR validity: ${isValid}`);

      const range = JSON.stringify(await getRewardRangeByLabel(prDetails));

      if (!isValid) {
        console.warn(`[WARN] PR not ready for reward — skipping.`);
        return "The PR is not yet ready for review, can't distribute reward yet";
      }

      console.log(`[DEBUG] Extracting contributor address...`);
      const address = extractAddressFromBody(prDetails[0]?.body!);
      console.log(`[DEBUG] Extracted address: ${address}`);

      console.log(`[DEBUG] Building patch diff object...`);
      const diff = await this.returnPatchObjects(fileDetails);
      console.log(`[DEBUG] Diff object prepared. Count: ${diff.length}`);

      console.log(`[DEBUG] Building AI prompt...`);
      const prompt = updatedBuildPrompt(diff, prDetails[0].title, range);
      console.log(`[DEBUG] Prompt (truncated):`, prompt.slice(0, 300) + "...");

      console.log(`[DEBUG] Sending prompt to agent...`);
      const agentResponse = await this.sendMessageToAgent([
        { role: "user", content: prompt },
      ]);
      console.log(`[DEBUG] Agent response:`, agentResponse);

      
      // Try to extract JSON substring from the response
      // const jsonMatch = agentResponse.text.match(/\{[\s\S]*\}/);
      // if (!jsonMatch) {
      //   console.error(`[ERROR] No JSON found in agent response text`);
      //   console.log(`[DEBUG] Full agent text:`, jsonMatch);
      //   return "Invalid response format from agent (no JSON found)";
      // }
      // let cleanText = agentResponse.text.trim();

      // if (agentResponse.status !== 200) {
      //   console.error(`[ERROR] Invalid response from agent`, agentResponse);
      //   return "Invalid response received from agent";
      // }

      console.log(`[DEBUG] Parsing agent response text...`);
      const response: {
        suggestedReward: number,
        comment: string
      } = agentResponse as any;
      console.log(`[DEBUG] Parsed response:`, response);


      console.log(`[DEBUG] Rewarding contributor...`);
      const txHash = await this.rewardContributor(address ?? this.ownerAccount, String(response.suggestedReward));
      console.log(`[DEBUG] Reward distributed successfully to ${address ?? this.ownerAccount}, with txHash: ${txHash.txHash}`);


      console.log(`[DEBUG] Adding comment to PR...`);
      await this.addCommentToPR(owner, repo, prNumber, ` ${response.comment} <br><hr> Check transaction here: https://testnet.monvision.io/tx/${txHash.txHash} <br> <b>Reward Granted:</b> ${response.suggestedReward} ${this.tokenSymbol} <i>(${this.tokenName})</i> `);
      console.log(`[DEBUG] Comment added successfully.`);

      console.log(`[DEBUG] Adding 'Rewarded' label to PR...`);
      await this.addRewardedLabelToPR(owner, repo, prNumber);
      console.log(`[DEBUG] Label added successfully.`);

      console.log(`[DEBUG][COMPLETE] Workflow finished successfully for ${owner}/${repo}#${prNumber}`);
      return { pr: prDetails[0].url, ...txHash };
    } catch (err: any) {
      console.error(`[ERROR][doAllAIAndBlockchainStuff]`, err);
      return `Error occurred: ${err.message}`;
    }
  }



  async chatExample() {
    const stream = await this.client.sendMessage("What's the weather like?");

    for await (const chunk of this.client.streamResponse(stream)) {
      console.log(chunk); // Process streaming response
    }
  }

  async onChainTest() {
    console.log("This is the details", this.onChainInteraction.contractDetails());
    return this.onChainInteraction.contractDetails()
  }

  async accountDetails(address?: string) {
    console.log("This is the accountDetails details", this.onChainInteraction.accountDetails());
    const balance = await this.onChainInteraction.getAddressBalance(address);
    const msg = `${address ? address : 'owner'}`
    return {
      ownerDetails: this.onChainInteraction.accountDetails(),
      balanceDetails: {
        balance,
        account: msg
      }
    }
  }

  async rewardContributor(address: string, amount: string) {
    const result = await this.onChainInteraction.rewardContributor(address, amount)
    console.log("This is the transfer details", result);
    return result
  }

  // ✅ New function to call /agent/chat
  async sendMessageToAgent(
    messages: ChatMessage[],
  ): Promise<AgentChatResponse> {
    try {
      console.log(`💬 Sending message to agent at ${this.agentBaseUrl}/agent/chat`);

      const response = await this.postraw<AgentChatResponse>('/agent/chat', {
        messages,
      });

      console.log(`🧠 Agent replied: ${JSON.stringify(response, null, 2)}`);
      return response;
    } catch (error: any) {
      console.error(`❌ Agent call failed: ${error.message}`, error.stack);
      throw error;
    }
  }
  async checkPRValidity(prs: any[]): Promise<boolean> {
    if (!Array.isArray(prs) || prs.length === 0) {
      throw new Error('No PR data provided.');
    }

    // Get the canonical label name (to avoid hardcoding)
    const readyForRewardLabel = Labels.find(l => l.name === 'Ready for reward');
    if (!readyForRewardLabel) {
      throw new Error('Ready for reward label not found in constants.');
    }

    const pr = prs[0]; // assuming single PR input, adjust if multiple

    if (!pr.labels || !Array.isArray(pr.labels)) {
      console.log('[DEBUG] No labels found in PR.');
      return false;
    }

    const hasReadyLabel = pr.labels.some(
      // TODO: Either check for name or id
      (label: any) => label.name.toLowerCase() === readyForRewardLabel.name.toLowerCase()
    );

    console.log(`[DEBUG] PR #${pr.number} ready for reward:`, hasReadyLabel);
    return hasReadyLabel;
  }


  async returnPatchObjects(fileChanges: any[]): Promise<string> {
    if (!Array.isArray(fileChanges) || fileChanges.length === 0) {
      throw new Error('No file changes provided.');
    }

    const patches: string[] = [];

    for (const file of fileChanges) {
      if (file?.patch) {
        // Optional: log or validate the file path
        console.log(`[PATCH] ${file.filename}`);
        patches.push(`\n# File: ${file.filename}\n${file.patch}`);
      }
    }

    if (patches.length === 0) {
      throw new Error('No patch data found in provided file changes.');
    }

    // Combine all patches into one string (like a unified diff)
    return patches.join('\n');
  }


}

