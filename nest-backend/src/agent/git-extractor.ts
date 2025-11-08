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
