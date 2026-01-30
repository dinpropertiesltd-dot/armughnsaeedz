
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartSummary = async (user, files) => {
  const ai = getAI();
  const context = files.map(f => ({
    id: f.fileNo,
    owner: f.ownerName,
    size: f.plotSize,
    totalVal: f.plotValue,
    paid: f.paymentReceived,
    balance: f.balance,
    overdue: f.overdue
  }));
  const prompt = `Executive summary for ${user.name}. Data: ${JSON.stringify(context)}. 3 sentences max. Auditor tone. No markdown.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    return "Analysis suspended.";
  }
};

export const generateWhatsAppRecoveryMessage = async (file) => {
  const ai = getAI();
  const prompt = `WhatsApp recovery for ${file.ownerName}, File: ${file.fileNo}, Balance: ${file.balance}. Professional tone.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    return `Salam ${file.ownerName}, balance update for ${file.fileNo}.`;
  }
};

export async function* streamChatResponse(message, role, contextData) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `DIN Properties Secure Registry Assistant. Role: ${role}. Context: ${JSON.stringify(contextData)}`,
    }
  });
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    throw error;
  }
}
