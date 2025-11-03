# OpenMaintainer Bounty Board

Bounties are automatically suggested and maintained by the AI agent.  
Each entry maps to an issue or PR with a corresponding token reward.

| ID | Issue/PR | Difficulty | Suggested Reward (OSS Tokens) | Status |
|----|-----------|-------------|-------------------------------|---------|
| 1 | #12 Add CLI interface | 🟠 Medium | 200 | 🟢 Open |
| 2 | #18 Improve AI prompt logic | 🔵 Hard | 350 | 🟢 Open |
| 3 | #25 Add test coverage | 🟢 Easy | 100 | 🟢 Open |

---

# AI Bounty Evaluation Criteria
The AI Maintainer evaluates and dynamically adjusts bounty rewards using multiple signals, including:

| Criterion                | Description                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Complexity**           | Number of files and lines changed, technical depth of logic, and potential side effects.               |
| **Impact**               | Alignment with core project goals and how much it improves usability, performance, or maintainability. |
| **Clarity & Quality**    | Code readability, comments, documentation added, and adherence to contribution guidelines.             |
| **Timeliness**           | How quickly the issue or PR was addressed relative to its creation date and urgency level.             |
| **Issue Age & Priority** | Older or high-priority issues may receive a bonus multiplier to incentivize completion.                |
| **Review Feedback**      | AI analyzes peer or maintainer reviews to assess collaboration and improvement from feedback.          |

## Reward Calculation
Each factor contributes to a composite bounty score, which determines the suggested reward tier:

| Difficulty                 | Reward Range (Tokens) |
| -------------------------- | --------------------- |
| 🟢 Easy                    | 50–150                |
| 🟠 Medium                  | 150–300               |
| 🔵 Hard                    | 300–500               |
| 🔴 Priority / Legacy Issue | 500–800               |

## Status
open, in_progress, completed, reward_pending, reward_distributed