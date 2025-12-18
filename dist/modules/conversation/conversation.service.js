"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
class ConversationService {
    constructor() {
        this.conversationHistory = [];
    }
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
    }
    getHistory() {
        return this.conversationHistory;
    }
    clearHistory() {
        this.conversationHistory = [];
    }
}
exports.ConversationService = ConversationService;
