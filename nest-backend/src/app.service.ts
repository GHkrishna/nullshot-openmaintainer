import { Injectable } from '@nestjs/common';
// import { getPR } from './utils/not-sure/github-client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { extractPRs } from './utils/git-extractor';
import { AgentClient } from './agent/agent';
import { OnChainTransaction } from './on-chain/on-chain';

@Injectable()
export class AppService {
  // TODO: I'm thinking if I should have a DB for now, something like neon db should be fine wid prisma, lets see


  private readonly baseUrl = 'https://api.github.com';
  private readonly token = process.env.GITHUB_FINEGRAINED_TOKEN;
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

  async get<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
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
  async post<T = any>(
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

  // Fetch PR list for a repo
  async getPullRequests(owner: string, repo: string) {
    console.log("[DEBUG] Fetching PRs for:", owner, repo);
    const response = await this.get(`/repos/${owner}/${repo}/pulls`);
    const prs = extractPRs(response);
    console.log("[DEBUG] Extracted PRs:", prs);
    return prs;
  }

  // Fetch PR diff/files
  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    console.log("[DEBUG] Fetching PR files for:", owner, repo, prNumber);
    return this.get(`/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
      Accept: 'application/vnd.github.v3.diff',
    });
  }

  // Add "Rewarded" label
  async addRewardedLabelToPR(owner: string, repo: string, prNumber: number) {
    console.log("[DEBUG] Adding 'Rewarded' label to PR:", prNumber);
    return this.post(
      `/repos/${owner}/${repo}/issues/${prNumber}/labels`,
      { labels: ["Rewarded"] }
    );
  }

  // Add custom labels
  async addLabelToPR(owner: string, repo: string, prNumber: number, labels: string[]) {
    console.log("[DEBUG] Adding labels to PR:", prNumber, "Labels:", labels);
    return this.post(
      `/repos/${owner}/${repo}/issues/${prNumber}/labels`,
      { labels: [...labels] }
    );
  }

  // Add comment to PR
  async addCommentToPR(owner: string, repo: string, prNumber: number, body: string) {
    console.log("[DEBUG] Adding comment to PR:", prNumber, "Body:", body);
    return this.post(
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

      const generatedComment: string = await this.generateFeedbackComment()

      // 3. Take comment from agent
      await this.addCommentToPR(owner, repo, prNumber, "Rewarded to the contributor successfully");
      console.log("[DEBUG] Comment added to PR");

      // 4.0. Extract address from PR description
      // 4. Distribute reward
      await this.distributeReward("address")
      return {"success": true};
    } catch(err) {
      console.log("Error occurred")
    }
  }
  async distributeReward(address: string) {
    // All the ochain interaction , I'll need to sdd here
    throw new Error('Method not implemented.');
  }
  async generateFeedbackComment(): Promise<string> {
    // This methoud would handle all the magic to get the PR feedback from openshot
    throw new Error('Method not implemented.');
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
      const msg = `${address? address: 'owner'}`
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

}
