export class EmotionService {
  detectEmotion(text: string) {
    return {
      emotion: "neutral",
      confidence: 0.5,
      sentiment: "neutral"
    };
  }
}
