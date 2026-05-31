const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');

const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY);

const getModel = (modelName = 'gemini-2.0-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getModel };
