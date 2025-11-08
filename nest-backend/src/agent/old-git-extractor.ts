export function extractPrData(prInfo: { number: any; title: any; user: { login: any; }; created_at: any; labels: any[]; additions: any; deletions: any; draft: any; body: any; }, prDiffFiles: any[]) {
  const prMetadata = {
    number: prInfo.number,
    title: prInfo.title,
    author: prInfo.user?.login,
    createdAt: prInfo.created_at,
    labels: prInfo.labels.map((l: { name: any; }) => l.name),
    additions: prInfo.additions ?? prDiffFiles.reduce((s: any, f: { additions: any; }) => s + f.additions, 0),
    deletions: prInfo.deletions ?? prDiffFiles.reduce((s: any, f: { deletions: any; }) => s + f.deletions, 0),
    changedFiles: prDiffFiles.length,
    isDraft: prInfo.draft,
    body: prInfo.body
  };

  const changes = prDiffFiles.map((f: { filename: any; status: any; additions: any; deletions: any; patch: any; }) => ({
    file: f.filename,
    status: f.status,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch
  }));

  const totalChanges = changes.reduce((sum: any, f: { additions: any; deletions: any; }) => sum + f.additions + f.deletions, 0);
  const isDocsOnly = changes.every((f: { file: string; }) => f.file.toLowerCase().includes("readme") || f.file.endsWith(".md"));

  const summary = {
    totalChanges,
    type: isDocsOnly ? "docs-only" : "mixed",
    complexity: totalChanges < 20 ? "very-low" : "medium",
    impact: isDocsOnly ? "minimal" : "unknown",
    recommendedRewardTier: isDocsOnly ? "🟢 Easy (50–150)" : "To be evaluated",
    notes: []
  };

  return { prMetadata, changes, summary };
}

