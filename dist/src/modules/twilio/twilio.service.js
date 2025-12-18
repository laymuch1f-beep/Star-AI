"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const twilio_1 = __importDefault(require("twilio"));
class TwilioService {
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
            console.warn("⚠️ Twilio credentials not found. Some features may not work.");
            this.client = null;
            this.phoneNumber = "";
        }
        else {
            this.client = (0, twilio_1.default)(accountSid, authToken);
            this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || "";
            console.log("✅ Twilio service initialized");
        }
    }
    async makeCall(to, message) {
        if (!this.client) {
            throw new Error("Twilio client not initialized. Check your credentials.");
        }
        try {
            const call = await this.client.calls.create({
                twiml: `<Response><Say voice="${process.env.AGENT_VOICE || "Polly.Joanna"}">${message}</Say></Response>`,
                to: to,
                from: this.phoneNumber
            });
            console.log(`📞 Outgoing call to ${to}, SID: ${call.sid}`);
            return {
                success: true,
                callSid: call.sid,
                message: "Call initiated successfully"
            };
        }
        catch (error) {
            console.error("Failed to make call:", error);
            throw error;
        }
    }
    generateTwiMLResponse(message) {
        const voice = process.env.AGENT_VOICE || "Polly.Joanna";
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}">
    ${message}
  </Say>
  <Gather input="speech" action="/twilio/handle-speech" method="POST"
          speechTimeout="auto" speechModel="phone_call"
          enhanced="true" actionOnEmptyResult="true">
    <Say voice="${voice}">How can I help you?</Say>
  </Gather>
</Response>`;
    }
    generateFollowUpTwiML(response) {
        const voice = process.env.AGENT_VOICE || "Polly.Joanna";
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}">${response}</Say>
  <Gather input="speech" action="/twilio/handle-speech" method="POST"
          speechTimeout="auto" speechModel="phone_call"
          enhanced="true" actionOnEmptyResult="true">
    <Say voice="${voice}">Is there anything else I can help with?</Say>
  </Gather>
</Response>`;
    }
    generateGoodbyeTwiML(message) {
        const voice = process.env.AGENT_VOICE || "Polly.Joanna";
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}">${message}</Say>
  <Hangup />
</Response>`;
    }
}
exports.TwilioService = TwilioService;
'@ | Out-File -FilePath src/modules/twilio/twilio.service.ts -Encoding UTF8;
