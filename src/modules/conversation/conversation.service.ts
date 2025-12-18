export class ConversationService {
  private conversationHistory: Array<{role: string, content: string}> = [];

  addToHistory(role: string, content: string) {
    this.conversationHistory.push({role, content});
    
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
