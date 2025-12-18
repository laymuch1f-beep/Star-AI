"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
class TwilioService {
    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
        this.authToken = process.env.TWILIO_AUTH_TOKEN || "";
        this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || "";
    }
    makeCall(to, message) {
        console.log(`Calling ${to} with message: ${message}`);
        return { success: true, callId: "simulated-call-id" };
    }
    sendSMS(to, message) {
        console.log(`Sending SMS to ${to}: ${message}`);
        return { success: true, messageId: "simulated-sms-id" };
    }
}
exports.TwilioService = TwilioService;
