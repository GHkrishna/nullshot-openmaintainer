export class AgentClient {
  constructor(private baseUrl: string) {}

  async sendMessage(message: string, sessionId?: string): Promise<ReadableStream> {
    const url = sessionId ? `${this.baseUrl}/agent/chat/${sessionId}` : `${this.baseUrl}/agent/chat`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body!;
  }

  async *streamResponse(stream: ReadableStream): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        yield chunk;
      }
    } finally {
      reader.releaseLock();
    }
  }
}

