@'
import OpenAI from "openai";

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ OpenAI API key not found. AI responses will be simulated.");
      this.openai = null as any;
    } else {
      this.openai = new OpenAI({ apiKey });
      console.log("✅ OpenAI service initialized");
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[]
  ): Promise<string> {
    // If OpenAI is not available, return a simulated response
    if (!this.openai) {
      return this.getSimulatedResponse(userMessage);
    }

    try {
      const systemPrompt = `You are ${process.env.AGENT_NAME || "Alex"}, a human-like voice assistant on a phone call.

PERSONALITY:
- Speak naturally like a human (use occasional "um", "ah", "hmm" sparingly)
- Be warm, empathetic, and conversational
- Keep responses brief (2-3 sentences for phone conversation)
- Sound genuinely interested in helping
- Remember previous conversation context

IMPORTANT: Your response will be converted to speech, so write it as you would speak it naturally.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // You can change to gpt-4 if available
        messages: messages,
        temperature: 0.8,
        max_tokens: 150,
      });

      let text = response.choices[0].message.content || this.getFallbackResponse();
      
      // Add human-like speech patterns occasionally
      text = this.addHumanSpeechPatterns(text);
      
      console.log(`🤖 Generated response: ${text.substring(0, 50)}...`);
      return text;
    } catch (error: any) {
      console.error("OpenAI error:", error.message);
      return this.getFallbackResponse();
    }
  }

  private getSimulatedResponse(userMessage: string): string {
    const responses = [
      `I understand you said "${userMessage}". As your assistant, I'm here to help you with that.`,
      `Thanks for sharing that. I'll do my best to assist you with "${userMessage}".`,
      `I hear you saying "${userMessage}". Let me think about how I can help you with that.`,
      `That's interesting! You mentioned "${userMessage}". How can I assist you further?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getFallbackResponse(): string {
    return "I apologize, but I'm having trouble processing that. Could you please repeat or rephrase?";
  }

  private addHumanSpeechPatterns(text: string): string {
    const patterns = [
      "Hmm, ",
      "Well, ",
      "You know, ",
      "I understand. ",
      "That makes sense. "
    ];

    // 30% chance to add a human-like prefix
    if (Math.random() < 0.3) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      text = pattern + text;
    }

    return text;
  }
}
'@ | Out-File -FilePath src/modules/openai/openai.service.ts -Encoding UTF8