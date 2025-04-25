require('dotenv').config();
const express = require('express');
const cors = require('cors');
const africastalking = require('africastalking');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = at.SMS;

// Default route (just to test)
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// SMS route
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await sms.send({
      to,
      message,
      from: 'CalSEA', // Optional in sandbox
    });

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 CalSEA backend running on http://localhost:${port}`);
});
