"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
class VoiceService {
    getAvailableVoices() {
        return [
            "Polly.Joanna",
            "Polly.Matthew",
            "Polly.Salli",
            "Polly.Kimberly",
            "Polly.Joey"
        ];
    }
}
exports.VoiceService = VoiceService;
