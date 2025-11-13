export function minimalExtractor(pr: any, files: any[]) {
  const prData = {
    pr: {
      number: pr.number,
      title: pr.title,
      author: pr.user?.login,
      labels: pr.labels?.map((l: any) => l.name.toLowerCase()) ?? [],
      add: files.reduce((s, f) => s + f.additions, 0),
      del: files.reduce((s, f) => s + f.deletions, 0),
      files: files.length,
    },
    changes: files.map((f: any) => ({
      file: f.filename,
      add: f.additions,
      del: f.deletions,
      patch: f.patch,
    })),
  };

  return prData;
}

export interface SimplifiedPR {
  id: number;
  number: number;
  title: string;
  state: string;
  url: string;
  body: string | null;
  createdAt: string;
  updatedAt: string;

  author: {
    login: string;
    avatar: string;
  };

  branches: {
    from: string;   // head.ref
    to: string;     // base.ref
  };

  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;

  assignees: string[];

  mergedAt: string | null;
}

export function extractPR(pr: any): SimplifiedPR {
  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    state: pr.state,
    url: pr.html_url,
    body: pr.body,

    createdAt: pr.created_at,
    updatedAt: pr.updated_at,

    author: {
      login: pr.user?.login,
      avatar: pr.user?.avatar_url,
    },

    branches: {
      from: pr.head?.ref,
      to: pr.base?.ref,
    },

    labels: pr.labels?.map((l: any) => ({
      id: l.id,
      name: l.name,
      color: l.color,
    })) || [],

    assignees: pr.assignees?.map((a: any) => a.login) || [],

    mergedAt: pr.merged_at,
  };
}

export function extractPRs(prs: any[]): SimplifiedPR[] {
  return prs.map(extractPR);
}

export function extractAddressFromBody(body: string): string | null {
  // Regex for Ethereum address (0x followed by 40 hex chars)
  const match = body.match(/0x[a-fA-F0-9]{40}/);
  return match ? match[0] : null;
}
