export interface Issue {
  id: number;
  title: string;
  url: string;
}

export interface PullRequest {
  id: number;
  url: string;
  author: string;
  merged: boolean;
}

export type BountyStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "reward_pending"
  | "reward_distributed";

export interface Evaluation {
  complexity: number;
  documentation: number;
  codeQuality: number;
}

export interface Bounty {
  id: string;
  issue: Issue;
  pullRequest: PullRequest;
  status: BountyStatus;
  reward: number;
  txHash?: string;
  evaluations?: Evaluation;
}
