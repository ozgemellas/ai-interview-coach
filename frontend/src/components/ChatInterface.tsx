import React, { useState, useRef, useEffect } from 'react';
import Experience from './Experience';
import { jsPDF } from 'jspdf';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 3D Avatar State
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("HR Answer Transcript", 10, 10);

        doc.setFontSize(12);
        let y = 30;

        // Add timestamp
        doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 10, 20);

        messages.forEach((msg) => {
            // Split text to fit page width
            const role = msg.role === 'user' ? "Candidate: " : "HR AI: ";
            const text = role + msg.content;
            const splitText = doc.splitTextToSize(text, 180);

            // Check page break
            if (y + (splitText.length * 7) > 280) {
                doc.addPage();
                y = 20;
            }

            // simple color coding implies setting text color before writing
            if (msg.role === 'user') {
                doc.setTextColor(0, 0, 255); // Blue for user
            } else {
                doc.setTextColor(0, 0, 0); // Black for AI
            }

            doc.text(splitText, 10, y);
            y += (splitText.length * 7) + 5; // Spacing
        });

        doc.save("interview_transcript.pdf");
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setAudioUrl(null); // Reset previous audio

        try {
            const history = [...messages, userMessage].map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: history,
                    model_name: "gemma:2b"
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // The AI text is added to the chat immediately after response
            const aiMessage: Message = { role: 'assistant', content: data.text };
            setMessages(prev => [...prev, aiMessage]);

            if (data.audio_base64) {
                // Create a blob URL for the audio to be reusable
                const audioBlob = await (await fetch(`data:audio/mp3;base64,${data.audio_base64}`)).blob();
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                setIsPlaying(true);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div className="flex flex-col h-screen w-full p-4 md:flex-row gap-4 bg-[#101622]">
            {/* 3D Avatar Area - 45% width on Desktop */}
            <div className="w-full md:w-5/12 flex flex-col gap-4">
                <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 ring-1 ring-white/5">
                    <Experience
                        audioUrl={audioUrl}
                        isPlaying={isPlaying}
                        onEnded={handleAudioEnd}
                    />

                    {/* Status Badge */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <div className={`size-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                        <span className="text-xs font-medium text-white/90 tracking-wide">
                            {isPlaying ? "SPEAKING" : "AWAITING RESPONSE"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat Area - 55% width on Desktop */}
            <div className="flex-1 flex flex-col h-full bg-[#101622] rounded-2xl shadow-xl overflow-hidden border border-white/10 ring-1 ring-white/5">

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#131b2c]">
                    <div>
                        <h2 className="font-bold text-white text-lg tracking-tight">AI Interviewer</h2>
                        <p className="text-slate-400 text-xs font-medium">Professional HR Assessment</p>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-[#135bec] hover:bg-blue-600 rounded-lg transition-all shadow-lg shadow-blue-600/20"
                        >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            TXT/PDF
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                            <span className="material-symbols-outlined text-[64px] mb-4">smart_toy</span>
                            <p className="text-lg font-medium">Ready to begin</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-slate-400 mb-1 px-1">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md
                                    ${msg.role === 'user'
                                        ? 'bg-[#135bec] text-white rounded-tr-none'
                                        : 'bg-[#1e293b] text-slate-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
                                <div className="size-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="size-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                <div className="size-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-white/5 bg-[#131b2c]">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your response..."
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-4 pl-5 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all font-medium"
                            disabled={isLoading || isPlaying}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || isPlaying || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-[#135bec] hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
