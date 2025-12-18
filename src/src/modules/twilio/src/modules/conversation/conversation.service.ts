@'
import { v4 as uuidv4 } from "uuid";

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ConversationMemory {
  id: string;
  phoneNumber: string;
  history: ConversationMessage[];
  totalCalls: number;
  lastCall: Date;
  preferences: Record<string, any>;
}

export class ConversationService {
  private memories: Map<string, ConversationMemory> = new Map();

  getMemory(phoneNumber: string): ConversationMemory {
    if (!this.memories.has(phoneNumber)) {
      this.memories.set(phoneNumber, {
        id: uuidv4(),
        phoneNumber,
        history: [{
          role: "system",
          content: `You are ${process.env.AGENT_NAME || "Alex"}, a human-like voice assistant. 
          Personality: ${process.env.AGENT_PERSONALITY || "friendly, empathetic, helpful"}.
          Speak naturally with occasional pauses. Remember previous conversations.`,
          timestamp: new Date()
        }],
        totalCalls: 0,
        lastCall: new Date(),
        preferences: {}
      });
    }
    
    const memory = this.memories.get(phoneNumber)!;
    memory.totalCalls++;
    memory.lastCall = new Date();
    
    return memory;
  }

  addMessage(phoneNumber: string, role: "user" | "assistant", content: string): void {
    const memory = this.getMemory(phoneNumber);
    memory.history.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Keep only last 15 messages
    if (memory.history.length > 15) {
      memory.history = memory.history.slice(-15);
    }
    
    console.log(`💾 Added ${role} message to ${phoneNumber}'s memory`);
  }

  getConversationContext(phoneNumber: string): ConversationMessage[] {
    const memory = this.getMemory(phoneNumber);
    return memory.history;
  }

  updatePreference(phoneNumber: string, key: string, value: any): void {
    const memory = this.getMemory(phoneNumber);
    memory.preferences[key] = value;
    console.log(`Updated preference for ${phoneNumber}: ${key}=${value}`);
  }

  getSummary(phoneNumber: string): string {
    const memory = this.getMemory(phoneNumber);
    const userMessages = memory.history.filter(msg => msg.role === "user");
    
    if (userMessages.length === 0) return "No conversation history yet.";
    
    const topics = userMessages.slice(-3).map(msg => 
      msg.content.substring(0, 30) + "..."
    ).join(", ");
    
    return `User has called ${memory.totalCalls} times. Recent topics: ${topics}`;
  }
}
'@ | Out-File -FilePath src/modules/conversation/conversation.service.ts -Encoding UTF8