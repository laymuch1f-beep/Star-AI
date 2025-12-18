"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionService = void 0;
class EmotionService {
    detectEmotion(text) {
        return {
            emotion: "neutral",
            confidence: 0.5,
            sentiment: "neutral"
        };
    }
}
exports.EmotionService = EmotionService;
