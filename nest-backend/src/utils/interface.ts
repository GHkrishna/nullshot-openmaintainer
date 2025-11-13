export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AgentChatResponse {
    text: string;
    status?: number;
}
export const Labels = [
    {
        "id": 9536074069,
        "name": "bug",
        "color": "d73a4a"
    },
    {
        "id": 9536074100,
        "name": "enhancement",
        "color": "a2eeef"
    },
    {
        "id": 9586344514,
        "name": "🟢 Easy",
        "color": "7bd852"
    },
    {
        "id": 9586345554,
        "name": "🟠 Medium",
        "color": "d9bf5d"
    },
    {
        "id": 9586346284,
        "name": "🔵 Hard",
        "color": "1d0791"
    },
    {
        "id": 9586347452,
        "name": "🔴 Priority / Legacy Issue",
        "color": "efa6c2"
    },
    {
        "id": 9597638649,
        "name": "Rewarded",
        "color": "6ba964"
    },
    {
        "id": 9597631584,
        "name": "Ready for reward",
        "color": "31c6c4"
    }
]


