import React, { useState } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import type { Comment } from '../types';
import { analyzeComments } from '../services/geminiService';

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState(['Most liked comment', 'Top comment', 'Summarize sentiment', 'Controversial opinion']);

  const handleAiAnalysis = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setAiResponse(null);
    
    const result = await analyzeComments(comments, query);
    
    setAiResponse(result.text);
    if (result.suggestedTags.length > 0) {
        setSuggestedTags(result.suggestedTags);
    }
    setLoading(false);
    setAiQuery('');
  };

  return (
    <div className="bg-[#1f1f1f] rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold">{comments.length} Comments</h3>
        <span className="text-xs text-gray-400">Sort by Top</span>
      </div>

      {/* AI Input Bar */}
      <div className="mb-6 bg-[#0f0f0f] p-3 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-2 text-purple-400 text-sm font-semibold">
          <Sparkles size={16} />
          <span>AI Insight</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask AI about these comments..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAiAnalysis(aiQuery)}
          />
          <button 
            onClick={() => handleAiAnalysis(aiQuery)}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-800 text-purple-400 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        
        {/* Suggested Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestedTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleAiAnalysis(tag)}
              className="px-3 py-1 text-xs bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full text-gray-300 transition-colors border border-gray-700"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* AI Response Area */}
        {(loading || aiResponse) && (
          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-purple-300 animate-pulse">
                <Sparkles size={14} /> Analyzing comments...
              </div>
            ) : (
              <p className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-purple-400 mr-2">AI:</span>
                {aiResponse}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment.username}</span>
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="text-sm mt-1 text-gray-300">{comment.text}</p>
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <button className="flex items-center gap-1 hover:text-white">
                  <ThumbsUp size={14} /> <span className="text-xs">{comment.likes}</span>
                </button>
                <button className="hover:text-white">
                  <ThumbsDown size={14} />
                </button>
                <button className="text-xs font-semibold hover:text-white">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;