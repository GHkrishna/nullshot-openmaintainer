# OpenMaintainer — Autonomous AI Maintainer for Open Source

> Built for **NullShot Hacks: Season 0** ([link](https://dorahacks.io/hackathon/nullshothacks/detail)) 

> Exploring the Agentic Web — powered by **NullShot**, **Edenlayer**, and **Thirdweb**

---

## Overview

OpenMaintainer is an **AI-driven virtual maintainer** for open-source repositories.  
It reviews pull requests, suggests improvements, and automatically manages contributor rewards using transparent on-chain bounties.

By merging **AI autonomy** with **Web3 verifiability**, it demonstrates how the next generation of *Agentic Systems* can support open-source ecosystems.

---

## Core Idea

Traditional open source relies on human maintainers — a scarce and overburdened resource.  
**OpenMaintainer** introduces an **AI Maintainer Agent** that:
- Reviews PRs automatically  
- Suggests bounty rewards for contributions using AI evaluation  
- Rewards contributors transparently using **Thirdweb smart contracts**  

---

## Key Components

| Layer | Role | Tech used |
|-------|------|------|
| **AI Agent** | Reviews PRs, analyzes contribution quality, and suggests bounty | NullShot TypeScript Agent Framework |
| **Web3 Layer** | Stores and distributes bounties | Thirdweb SDK + Solidity (Polygon testnet) |
| **Bridge** | Links GitHub events ↔ AI logic ↔ blockchain calls | Node.js scripts |
| **MCP** | Enables discoverable and composable agent actions | Edenlayer / NullShot MCP API |

---

## Example Flow

1. **Developer submits PR**
2. **AI Maintainer (via NullShot Agent)** reviews PR and generates:
   - Summary  
   - Review comments  
   - Suggested bounty range (based on complexity, quality, and effort)
3. Maintainer approves → **bounty auto-released** via Thirdweb contract  
4. Contributor receives reward tokens transparently on-chain

---

## Token & Reward Mechanism

- Rewards are defined in [`bounty.md`](./bounty.md)
- AI can update this dynamically based on contribution quality
- Smart contract ensures transparent distribution

---

## Architecture

See [`architecture.md`](./architecture.md) for a detailed breakdown.

High-level:

```plaintext
GitHub PR → NullShot AI Maintainer → AI Evaluation
     ↓
Suggested Bounty → Thirdweb Contract → On-chain Reward
```

# Tech stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| AI Agent       | NullShot TypeScript Agent Framework |
| AI Model       | LLM (OpenAI / Local Ollama)         |
| Smart Contract | Solidity + Thirdweb SDK             |
| Backend        | Node.js                             |
| Blockchain     | Polygon / Sepolia testnet           |
| Integration    | GitHub REST API + Ethers.js         |



