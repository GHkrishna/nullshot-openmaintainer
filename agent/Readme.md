## Agent flow Summary

1. You tag merged PRs with "ready-for-review".
2. The agent checks these locally (mockPRs for now).
3. It evaluates effort and assigns a bounty within the defined range.
4. Then mock distributes reward and generates a fake txHash.
5. Updates tag to reward_distributed.
6. Dashboard displays the new status + clickable hash.