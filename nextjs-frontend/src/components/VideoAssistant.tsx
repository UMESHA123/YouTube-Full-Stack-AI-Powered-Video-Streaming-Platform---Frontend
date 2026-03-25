import { getPromptResponse, getSuggestedPrompt, getTranscript, manualQueryAnsGenerator } from '@/APIS'
import { ChatMessage, VideoPlay } from '@/types/types'
import { Bot, MoreHorizontal, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type VideoAssistantType = {
    video: VideoPlay
}

const VideoAssistant: React.FC<VideoAssistantType> = ({ video }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [vttUrl, setVttUrl] = useState<string | null>(null);
    const [suggestionChips, setSuggestionChips] = useState<string[]>([])

    // const messagesEndRef = useRef<HTMLDivElement>(null);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    useEffect(() => {
        const fetchTranscript = async () => {
            const response = await getTranscript(video?._id || "");

            setVttUrl(response?.data?.transcriptUrl);
            const suggestedPromptResponse: any = await getSuggestedPrompt(response?.data?.transcriptUrl!)
            if (suggestedPromptResponse?.statusCode === 200 && suggestedPromptResponse?.success === true) {
                console.log("suggested prompt response: ", suggestedPromptResponse.data);
                setSuggestionChips([...suggestedPromptResponse?.data?.response[0]?.keywords])
            } else {
                console.log("some issue with the suggested useeffect")
            }
        };

        fetchTranscript();

    }, [video?._id]);

    const getPromptResponseHandler = async (query: string) => {
        try {
            if (!query.trim()) return;

            const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', title: "", summary: query, keywords: [""] };
            setMessages(prev => [...prev, userMsg]);
            setInput('');
            setIsLoading(true);
            const response = await getPromptResponse(query)
            console.log("the prompt response frontend response: ", response.data);
            if (response?.statusCode === 200) {
                console.log("success")

                const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', title: "", summary: response?.data?.response[0]?.answer, keywords: response?.data?.response[0]?.keywords };

                setMessages(prev => [...prev, aiMsg]);
                setIsLoading(false);

            }

        } catch (error) {
            console.log("error in getpromptresponsehandler: ", error);
            setIsLoading(false);

        }
    }

    useEffect(() => {
        setMessages([])
        setSuggestionChips([])
    }, [video?._id])

    const handleManulQueryAnsGenerator = async () => {
        try {
            const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', title: "", summary: input, keywords: [""] };
            setMessages(prev => [...prev, userMsg]);
            setIsLoading(true);
            const response = await manualQueryAnsGenerator(input, vttUrl || "")
            console.log("manual query ans: response: ", response)
            if (response?.statusCode === 200) {
                const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', title: "", summary: response?.data?.kwargs?.content, keywords: [""] };

                setMessages(prev => [...prev, aiMsg]);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error in manul query handler function: ", error);
            setIsLoading(false);

        }
    }

    const handleSend = async (text: string) => {

    };


    return (
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333] flex flex-col h-[500px] mb-6 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-[#333] bg-[#252525] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-600 rounded-lg">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-sm">Video Assistant</span>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 bg-[#1e1e1e] h-64 overflow-y-scroll scrollbar-custom ">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4 opacity-80">
                        <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-purple-400" />
                        </div>
                        <p className="text-sm max-w-[200px]">Ask anything about "{video?.title}"</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {suggestionChips.map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => getPromptResponseHandler(chip)}
                                    className="text-xs bg-[#2a2a2a] hover:bg-[#3a3a3a] text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/20 transition-all"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-none'
                                    : 'bg-[#2a2a2a] text-gray-100 rounded-bl-none'
                                    }`}>
                                    {msg.summary}
                                    {
                                        msg.role != 'user' && <div className="flex flex-wrap gap-2 mt-2">
                                            {msg.keywords.map((tag, tIdx) => (
                                                <button

                                                    key={tIdx}
                                                    onClick={() => getPromptResponseHandler(tag)}
                                                    className="text-xs px-2.5 py-1 bg-[#1f1f1f] border border-gray-700 hover:border-purple-500 hover:text-purple-400 rounded-md text-gray-400 transition-all"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    }
                                </div>

                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#2a2a2a] rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        {/* <div ref={messagesEndRef} /> */}
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#333] bg-[#252525]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Ask follow-up..."
                        className="w-full bg-[#121212] text-white text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-[#333]"
                    />
                    <button
                        onClick={() => handleManulQueryAnsGenerator()}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 hover:bg-purple-500 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VideoAssistant