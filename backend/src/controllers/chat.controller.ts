import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = "You are a helpful and knowledgeable health assistant for the SymptomSync app. Provide general health and wellness information. Always advise users to consult a healthcare professional for serious concerns or diagnoses.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
};
