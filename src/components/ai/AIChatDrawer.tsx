'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, AlertTriangle, ShieldCheck, User, Loader2, RefreshCw } from 'lucide-react';

interface AIChatDrawerProps {
  assignmentId: string;
  assignmentTitle: string;
  initialRemainingRequests: number;
  initialRemainingTokens: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
  timestamp: string;
}

export function AIChatDrawer({
  assignmentId,
  assignmentTitle,
  initialRemainingRequests,
  initialRemainingTokens,
}: AIChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(initialRemainingRequests);
  const [remainingTokens, setRemainingTokens] = useState(initialRemainingTokens);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your Socratic Debugging Assistant for **${assignmentTitle}**.\n\nYou can ask me questions about architecture, debugging strategies, stack trace meanings, or testing approaches. Note that I am strictly configured as a mentor and will never write the direct solution code for you. How can I help you debug?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (remainingRequests <= 0 || remainingTokens <= 0) {
      alert('You have reached your daily AI usage limit. Check your dashboard for quota resets.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          message: userMessage.content,
          history: messages.slice(-4), // context window of last 4 messages
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ **AI Limit / System Notice**: ${data.error || 'Failed to generate response.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (data.remainingRequests !== undefined) setRemainingRequests(data.remainingRequests);
        if (data.remainingTokens !== undefined) setRemainingTokens(data.remainingTokens);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            tokens: data.tokensUsed,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (data.remainingRequests !== undefined) setRemainingRequests(data.remainingRequests);
        if (data.remainingTokens !== undefined) setRemainingTokens(data.remainingTokens);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Network error communicating with the DebugLab AI proxy.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating or Embedded Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-accent-indigo px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-purple-500 hover:to-indigo-500 transition"
      >
        <Sparkles className="h-4 w-4" />
        <span>Ask AI Assistant</span>
        <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-mono">
          {remainingRequests} left
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex h-full w-full max-w-lg flex-col border-l border-card-border bg-[#0a0f1d] shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-card-border p-4 bg-[#0d1424]">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">DebugLab AI Assistant</h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-accent-cyan">{remainingRequests} requests</span>
                    <span>•</span>
                    <span>{remainingTokens.toLocaleString()} tokens left</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Disclaimer Banner */}
            <div className="border-b border-card-border/60 bg-amber-950/20 px-4 py-2 text-[11px] text-amber-300/90 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                Controlled assessment assistant. Explains concepts and debugging steps without generating direct solution code.
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 mb-1 px-1">
                    {msg.role === 'user' ? (
                      <>
                        <span>You</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3 text-purple-400" />
                        <span className="text-purple-300 font-medium">DebugLab AI</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.tokens && <span>({msg.tokens} tokens)</span>}
                      </>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-accent-indigo text-white rounded-tr-none'
                        : 'border border-card-border bg-[#0d1424] text-slate-200 rounded-tl-none font-sans'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span>AI assistant is analyzing your inquiry...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="border-t border-card-border p-4 bg-[#0d1424]">
              <div className="relative">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={
                    remainingRequests > 0
                      ? 'Ask about the bug symptoms, stack trace, or architecture...'
                      : 'Daily AI quota exhausted'
                  }
                  disabled={loading || remainingRequests <= 0}
                  className="w-full resize-none rounded-xl border border-card-border bg-[#090d16] p-3 pr-12 text-xs text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || remainingRequests <= 0}
                  className="absolute bottom-3 right-3 rounded-lg bg-accent-cyan p-1.5 text-slate-950 hover:bg-cyan-400 transition disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Press Enter to send, Shift+Enter for newline</span>
                <span>Max {remainingRequests} questions left today</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
