# OpenMaintainer — Autonomous AI Maintainer for Open Source

> Built for **NullShot Hacks: Season 0** ([link](https://dorahacks.io/hackathon/nullshothacks/detail)) 

> Exploring the Agentic Web — powered by **NullShot**, **Edenlayer**, and **Thirdweb**
---
## Important links
Frontend repo: https://github.com/GHkrishna/nullshot-open-maintainer-ui

Demo video: https://youtu.be/gH0pqsYY-2g

Brainstorm: https://nullshot.ai/brainstorm/9c32b729-05b9-4b5e-a822-49a562a91c96

Deployed contract: https://monad-testnet.socialscan.io/address/0xe35928e33d27325699d31513bedb818fc73cc795

---

## Overview

OpenMaintainer is an **AI-driven virtual maintainer** for open-source repositories.  
It reviews pull requests, might suggest improvements in the future, and automatically manages contributor rewards using transparent on-chain bounties.

By merging **AI autonomy** with **Web3 verifiability**, it demonstrates how the next generation of *Agentic Systems* can support open-source ecosystems.

---

## Core Idea

Traditional open source relies on human maintainers — a scarce and overburdened resource.  
**OpenMaintainer** introduces an **AI Maintainer Agent** that:
- Reviews PRs automatically  (This might be pushed for further scope, or an agent like coderabbit can be used instead of having everything build from scratch)
- Suggests bounty rewards for contributions using AI evaluation  
- Rewards contributors transparently using **Thirdweb smart contracts**  

---

## Key Components

| Layer | Role | Tech used |
|-------|------|------|
| **AI Agent** | Reviews PRs(future scope), analyzes contribution quality, and suggests bounty | NullShot TypeScript Agent Framework |
| **Web3 Layer** | Stores and distributes bounties | Thirdweb API + Solidity (Monad testnet) |
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
| AI Model       | LLM (Anthropic)         |
| Smart Contract | Solidity + Remix + Thirdweb             |
| Backend        | Nestjs                             |
| Blockchain     | Monad testnetc         |
| Integration    | GitHub REST API + Thirdweb API         |


# Setup Instructions

## Pre-requisite
- Github account and the access token with appropriate read write access to the repo
- Anthropic API keys
- Thirdweb API keys
- A deployed contrat on Monad testnet (with ERC20, tokens loaded in the generated address - see `Contract` section below)
- Github repo with appropriate tags, as specified in the `Bounty.md` file
- And a smile on ur face, coz this is a nobel cause that we would be using the solution for. (OSS is awesome 😉 )

## Backend
```bash
git clone https://github.com/GHkrishna/nullshot-openmaintainer
cd nest-backend
cp .env.example .env
npm install
npm run dev
```

For the `.env` values refer the instructions specified in `.env.example` 

## Run AI maintainer:

```bash
cd ../agent
```
Add the following in `.dev.vars` and `.env`
```
AI_PROVIDER_API_KEY= your key
MODEL_ID= your anthropic model
AI_PROVIDER=anthropic
```

Run the agent
```bash
npm install
npm run dev
```

## Frontend
```
git clone https://github.com/GHkrishna/v0-ai-maintainer-ui.git
cp .env.example .env
npm run dev
```

## Contract
For now, you could simply deploy your own contract specified in the `./contracts` folder
1. Get the address created by you on `/on-chain/owner-account`
2. Mint some token as the `contract` owner and send them to the `created account`

# Hackathon Relevance
- NullShot Framework: used for building the AI agent
- Edenlayer MCP: ensures agent interoperability
- Thirdweb: handles smart contract deployment + token management

This project exemplifies the Agentic Economy — autonomous AI agents creating and distributing real economic value through verifiable, decentralized actions.

# Future Scope
- Decentralized Agent Marketplace
  - Allow developers to create and publish their own AI agents for open source workflows.
  - Repositories can “plug and play” these agents (e.g., reviewer bot, issue triager, contributor engagement bot).

- Contributor Reputation & Insights
  - Introduce a scoring system to quantify impact beyond code — reviews, discussions, issue reports, etc.
  - These insights can help projects identify potential maintainers or reward genuine contributors.

- AI-Governed Bounty Management
  - Instead of manual or DAO voting, use AI-assisted reputation and contribution data to suggest and prioritize bounties automatically.
  - Later, a DAO layer can be added for decentralized validation and reward distribution.

- Multi-Agent Collaboration for Large Repositories
  - Enable multiple specialized agents (for docs, testing, CI/CD, etc.) to work together on large, multi-repo projects.
  - Agents can share context securely and coordinate to maintain consistency across repositories.
