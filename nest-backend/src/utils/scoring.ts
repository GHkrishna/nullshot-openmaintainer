export function getRewardRangeByLabel(prs: any[]): { min: number; max: number } {
  if (!Array.isArray(prs) || prs.length === 0) {
    throw new Error('No PR data provided.');
  }
  
  let range: { min: number; max: number };
  const pr = prs[0]; // assuming single PR input
  if (!pr.labels || !Array.isArray(pr.labels)) {
    console.log('[DEBUG] No labels found in PR.');
    range = { min: 50, max: 800 };
  }

  const difficultyLabel = pr.labels.find((label: any) => {
    const name = label.name.toLowerCase();
    return (
      name.includes('🟢 easy') ||
      name.includes('🟠 medium') ||
      name.includes('🔵 hard') ||
      name.includes('🔴 priority')
    );
  });

  if (!difficultyLabel) {
    console.log('[DEBUG] No difficulty label found on PR.');
    range = { min: 50, max: 800 };
  }


  switch (difficultyLabel.name) {
    case '🟢 Easy':
      range = { min: 50, max: 150 };
      break;
    case '🟠 Medium':
      range = { min: 150, max: 300 };
      break;
    case '🔵 Hard':
      range = { min: 300, max: 500 };
      break;
    case '🔴 Priority / Legacy Issue':
      range = { min: 500, max: 800 };
      break;
    default:
      range = { min: 50, max: 800 };
  }

  console.log(`[DEBUG] PR #${pr.number} difficulty: ${difficultyLabel.name}, Reward range:`, range);
  return range;
}
