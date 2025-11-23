import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import type { Video } from '../types';
import { chatAboutVideo } from '../services/geminiService';

interface VideoChatProps {
  video: Video;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  tags?: string[];
}

const VideoChat: React.FC<VideoChatProps> = ({ video }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultTags = ["Summarize video", "Key takeaways", "What is the conclusion?"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Optimistic user update
    const userMsg: ChatMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const result = await chatAboutVideo(video, text);
    
    setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: result.text,
        tags: result.suggestedTags 
    }]);
    setLoading(false);
  };

  return (
    <div className="bg-[#1f1f1f] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-3 bg-[#252525] border-b border-gray-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-600 rounded-lg">
                <Sparkles size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold text-sm text-gray-200">Video Assistant</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#121212]">
        {messages.length === 0 && (
          <div className="text-center mt-8 px-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot size={24} className="text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Ask anything about "{video.title}"</p>
            <div className="flex flex-wrap justify-center gap-2">
                {defaultTags.map((tag, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(tag)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                    <Sparkles size={14} className="text-purple-400" />
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                    <User size={14} className="text-blue-400" />
                </div>
            )}
            
            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-[#2a2a2a] text-gray-200 rounded-tl-none border border-gray-700 shadow-sm'
                }`}>
                    {msg.text}
                </div>
                
                {/* Suggested Tags for AI Response */}
                {msg.sender === 'ai' && msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {msg.tags.map((tag, tIdx) => (
                            <button
                                key={tIdx}
                                onClick={() => handleSend(tag)}
                                className="text-xs px-2.5 py-1 bg-[#1f1f1f] border border-gray-700 hover:border-purple-500 hover:text-purple-400 rounded-md text-gray-400 transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </div>
        ))}
        
        {loading && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-purple-400 animate-pulse" />
             </div>
             <div className="bg-[#2a2a2a] px-4 py-3 rounded-2xl rounded-tl-none border border-gray-700">
               <div className="flex gap-1">
                 <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#1f1f1f] border-t border-gray-800">
        <div className="relative flex items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask follow-up..."
                className="w-full bg-[#121212] border border-gray-700 text-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="absolute right-1.5 p-1.5 bg-purple-600 rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all"
            >
                <Send size={14} className="text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;