import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "../types";

// Prefer VITE_ prefixed env for client-side Vite apps
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const isKeyValid = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey !== '';

// Lazy initializer for Gemini client
let genAI: GoogleGenerativeAI | null = null;
const getAi = () => {
  if (genAI) return genAI;
  if (isKeyValid) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      return genAI;
    } catch (e) {
      console.error("Failed to initialize GoogleGenerativeAI:", e);
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
    console.warn("AI Assistant: API Key missing or invalid.");
    return "The AI assistant is currently unavailable because a valid Gemini API key was not found. Please add your key to the .env file.";
  }

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: `You are FloraBot, an expert AI botanist and gardening assistant for the Floraverse application.

YOUR MANDATE:
1. **Accuracy is Paramount**: Provide scientifically accurate information.
2. **Plant Identification**: When identifying plants, ALWAYS provide the Common Name and the Scientific Name (in italics).
3. **Disease Diagnosis**: If presented with an image of a sick plant:
   - Identify the specific pathogen or pest (e.g., "Powdery Mildew", "Aphids").
   - Suggest 1 Organic Remedy (e.g., Neem oil, pruning).
   - Suggest 1 Chemical/Commercial Remedy if severe.
4. **Context Awareness**: Use the conversation history to answer follow-up questions.
5. **Scope Enforcement**: STRICTLY limit answers to gardening, plants, botany, and agriculture. If a user asks about unrelated topics, politely refuse and ask to return to gardening topics.

Keep responses concise, structured, and helpful for a home gardener.`
    });

    // 1. Format History for the API
    // Filter history to ensure it starts with a 'user' message and follows the required sequence
    const validHistory = [];
    for (const msg of history) {
      // Skip the welcome message and any empty text
      if (msg.id === 'welcome' || !msg.text.trim()) continue;

      // Ensure we alternate roles and start with user
      const expectedRole = validHistory.length % 2 === 0 ? 'user' : 'model';
      const role = msg.role === 'model' ? 'model' : 'user';

      if (role === expectedRole) {
        validHistory.push({
          role: role,
          parts: [{ text: msg.text }]
        });
      }
    }

    // 2. Add the Current Message
    const currentParts: any[] = [];
    if (imageBase64) {
      currentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      });
      if (userMessage) {
        currentParts.push({ text: `[Image Analysis Request] ${userMessage}` });
      } else {
        currentParts.push({ text: "Analyze this plant image. Identify the plant or diagnose any visible diseases." });
      }
    } else {
      currentParts.push({ text: userMessage });
    }

    // 3. Call the API using startChat for session-based interaction
    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(currentParts);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Handle specific API errors gracefully
    if (error.message?.includes('API_KEY_INVALID')) {
      return "The provided Gemini API key seems to be invalid. Please check your .env file.";
    }

    return "Sorry, I'm having trouble connecting to the AI right now. Please check your connection or try again later.";
  }
};

