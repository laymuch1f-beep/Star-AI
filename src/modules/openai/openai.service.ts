export class OpenAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  async generateResponse(prompt: string): Promise<string> {
    // Simplified for now
    return "This is a simulated response from OpenAI.";
  }
}
