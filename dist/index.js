"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = 3000;
// CRITICAL: Use bodyParser for Twilio
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});
// Test page
app.get('/', (req, res) => {
    res.send(`
    <h1>Windows Voice Agent - WORKING!</h1>
    <p>Server time: ${new Date().toLocaleTimeString()}</p>
    <p>Test webhook with:</p>
    <code>curl -X POST http://localhost:3000/voice -d "From=+1234567890"</code>
  `);
});
// SIMPLE webhook that ALWAYS works
app.post('/voice', (req, res) => {
    console.log('✅✅✅ TWILIO WEBHOOK RECEIVED!');
    console.log('Call from:', req.body.From);
    console.log('Call to:', req.body.To);
    console.log('Full body:', req.body);
    // Simple response that proves it's working
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    CONGRATULATIONS! Your Windows voice agent is WORKING!
    This is NOT Twilio's default agent.
    Server received your call at ${new Date().toLocaleTimeString()}.
    How can I help you today?
  </Say>
  <Gather input="speech" action="/voice/handle" method="POST" speechTimeout="3">
    <Say>Please tell me what you need.</Say>
  </Gather>
  <Say>Goodbye!</Say>
  <Hangup/>
</Response>`;
    res.set('Content-Type', 'text/xml');
    res.send(twiml);
});
// Handle speech
app.post('/voice/handle', (req, res) => {
    console.log('Speech received:', req.body.SpeechResult);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>I heard: ${req.body.SpeechResult || 'nothing'}. Thank you!</Say>
  <Hangup/>
</Response>`;
    res.set('Content-Type', 'text/xml');
    res.send(twiml);
});
// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🚀 WINDOWS VOICE AGENT STARTED                    ║
  ║                                                      ║
  ╠══════════════════════════════════════════════════════╣
  ║                                                      ║
  ║   🌐 Local:    http://localhost:${PORT}            ║
  ║   📞 Webhook:  POST /voice                         ║
  ║   🗣️  Handler: POST /voice/handle                  ║
  ║                                                      ║
  ╠══════════════════════════════════════════════════════╣
  ║                                                      ║
  ║   ✅ Ready for Twilio calls!                        ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
