import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const isKeyValid = apiKey && apiKey !== 'your_gemini_api_key_here';

// Lazy initializer for Gemini client to prevent top-level browser crashes
let aiInstance: GoogleGenAI | null = null;
const getAi = () => {
  if (aiInstance) return aiInstance;
  if (isKeyValid) {
    try {
      aiInstance = new GoogleGenAI(apiKey);
      return aiInstance;
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
    }
  }
  return null;
};

export const generateChatResponse = async (
  history: ChatMessage[],
  userMessage: string,
  imageBase64?: string
): Promise<string> => {
  const ai = getAi();
  if (!ai) {
    return "The AI assistant is currently unavailable because a valid Gemini API key was not found. Please add your key to the .env file.";
  }

  try {
    const model = 'gemini-1.5-flash';

    // 1. Format History for the API
    // We strictly map the existing chat messages to the format Gemini expects.
    // Note: We only send text history to save bandwidth/tokens, relying on the model's 
    // previous text responses to recall context of previous images.
    const historyContents: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // 2. Construct the Current Message Content
    const currentParts: any[] = [];

    if (imageBase64) {
      currentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      });
      // Add a specific instruction if an image is present
      currentParts.push({
        text: userMessage ? `[Image Analysis Request] ${userMessage}` : "Analyze this plant image. Identify the plant or diagnose any visible diseases."
      });
    } else {
      currentParts.push({ text: userMessage });
    }

    // Combine history and current message
    const contents = [
      ...historyContents,
      { role: 'user', parts: currentParts }
    ];

    // 3. Call the API with optimized configuration
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: `You are FloraBot, an expert AI botanist and gardening assistant for the Floraverse application.

YOUR MANDATE:
1. **Accuracy is Paramout**: Provide scientifically accurate information.
2. **Plant Identification**: When identifying plants, ALWAYS provide the Common Name and the Scientific Name (in italics).
3. **Disease Diagnosis**: If presented with an image of a sick plant:
   - Identify the specific pathogen or pest (e.g., "Powdery Mildew", "Aphids").
   - Suggest 1 Organic Remedy (e.g., Neem oil, pruning).
   - Suggest 1 Chemical/Commercial Remedy if severe.
4. **Context Awareness**: Use the conversation history to answer follow-up questions (e.g., "How often should I water *it*?").
5. **Scope Enforcement**: STRICTLY limit answers to gardening, plants, botany, and agriculture. If a user asks about math, coding, or politics, politely refuse and ask to return to gardening topics.

Keep responses concise, structured, and helpful for a home gardener.`,
        temperature: 0.3, // Lower temperature for more factual, less creative responses
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the gardening knowledge base right now. Please check your connection or try again later.";
  }
};
