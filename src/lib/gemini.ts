import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenAI({ apiKey });

export const models = {
  flash: 'gemini-3-flash-preview',
  pro: 'gemini-3.1-pro-preview'
};
