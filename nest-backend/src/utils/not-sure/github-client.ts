import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_FINEGRAINED_TOKEN,
});

export async function getPRFiles(owner: string, repo: string, pull_number: number) {
  const files = await octokit.pulls.listFiles({ owner, repo, pull_number });
  return files.data;
}

export async function getPR(owner: string, repo: string, pull_number: number) {
  const pr = await octokit.pulls.get({ owner, repo, pull_number });
  return pr.data;
}

export async function addLabel(owner: string, repo: string, issue_number: number, labels: string[]) {
  await octokit.issues.addLabels({ owner, repo, issue_number, labels });
}

export async function addComment(owner: string, repo: string, issue_number: number, body: string) {
  await octokit.issues.createComment({ owner, repo, issue_number, body });
}

