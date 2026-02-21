import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Bot, User, Loader2 } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am FloraBot. I can help you with gardening tips, plant identification, and disease diagnosis. Upload a photo or ask me a question!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const fileToGenerativePart = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data url prefix "data:image/jpeg;base64," to get raw base64
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsgId = Math.random().toString(36).substr(2, 9);
    const newMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: input,
      image: previewUrl || undefined
    };

    // Capture current history BEFORE adding the new message
    // This prevents duplicating the user message in the history array sent to API
    const currentHistory = [...messages];

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let imageBase64: string | undefined = undefined;
      if (selectedImage) {
        imageBase64 = await fileToGenerativePart(selectedImage);
      }

      // Pass the history and the new message details separately
      const responseText = await generateChatResponse(currentHistory, newMessage.text, imageBase64);

      const botMsgId = Math.random().toString(36).substr(2, 9);
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: responseText
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        text: "Sorry, I encountered an error processing your request."
      }]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      <div className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="text-flora-600 h-6 w-6" />
          <h1 className="text-xl font-bold text-gray-800">FloraBot Assistant</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] md:max-w-[70%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-flora-600' : 'bg-gray-700'}`}>
                {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
              </div>

              <div className={`p-4 rounded-lg shadow-sm ${msg.role === 'user'
                  ? 'bg-flora-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                {msg.image && (
                  <img src={msg.image} alt="User upload" className="mb-2 max-w-full rounded-md max-h-64 object-cover" />
                )}
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-lg rounded-bl-none shadow-sm ml-10">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-flora-500" />
                <span className="text-gray-500 text-sm">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        {previewUrl && (
          <div className="mb-2 inline-block relative">
            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
            <button
              onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-flora-600 transition">
            <ImageIcon className="h-6 w-6" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </label>

          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent"
            placeholder="Type your question or upload a plant photo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-flora-600 text-white p-2 rounded-full hover:bg-flora-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
