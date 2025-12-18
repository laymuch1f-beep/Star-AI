"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const uuid_1 = require("uuid");
class ConversationService {
    constructor() {
        this.memories = new Map();
    }
    getMemory(phoneNumber) {
        if (!this.memories.has(phoneNumber)) {
            this.memories.set(phoneNumber, {
                id: (0, uuid_1.v4)(),
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
        const memory = this.memories.get(phoneNumber);
        memory.totalCalls++;
        memory.lastCall = new Date();
        return memory;
    }
    addMessage(phoneNumber, role, content) {
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
    getConversationContext(phoneNumber) {
        const memory = this.getMemory(phoneNumber);
        return memory.history;
    }
    updatePreference(phoneNumber, key, value) {
        const memory = this.getMemory(phoneNumber);
        memory.preferences[key] = value;
        console.log(`Updated preference for ${phoneNumber}: ${key}=${value}`);
    }
    getSummary(phoneNumber) {
        const memory = this.getMemory(phoneNumber);
        const userMessages = memory.history.filter(msg => msg.role === "user");
        if (userMessages.length === 0)
            return "No conversation history yet.";
        const topics = userMessages.slice(-3).map(msg => msg.content.substring(0, 30) + "...").join(", ");
        return `User has called ${memory.totalCalls} times. Recent topics: ${topics}`;
    }
}
exports.ConversationService = ConversationService;
'@ | Out-File -FilePath src/modules/conversation/conversation.service.ts -Encoding UTF8;
