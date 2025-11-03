export function scoreIssue(issue: any) {
  let score = 100;

  if (issue.urgency === "high") score += 80;
  if (issue.docsAdded) score += 20;
  if (issue.codeQuality === "excellent") score += 50;

  const ageDays =
    (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 3600 * 24);
  if (ageDays > 20) score += 30;

  return Math.round(score);
}
