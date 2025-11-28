const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Medical context system prompt
const MEDICAL_SYSTEM_PROMPT = `You are a helpful medical assistant designed to support doctors in their work. Your role is to:

1. Provide quick access to medical information and references
2. Help with differential diagnosis considerations
3. Suggest treatment guidelines and medication information
4. Assist with medical calculations and formulas
5. Provide research summaries and clinical guidelines

IMPORTANT: Always remind users that you are an AI assistant and not a substitute for professional medical judgment. Critical decisions should be made by qualified healthcare professionals.

Format responses in a clear, organized manner suitable for medical professionals.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      {
        role: 'system',
        content: MEDICAL_SYSTEM_PROMPT
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1500,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Doctor Chatbot'
      }
    });

    const botResponse = response.data.choices[0].message.content;
    
    res.json({
      response: botResponse,
      usage: response.data.usage
    });

  } catch (error) {
    console.error('Error calling OpenRouter API:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get response from AI service',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});