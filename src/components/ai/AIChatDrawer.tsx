'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, ShieldCheck, User, Loader2 } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

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
  image?: string;
  isPlatformQuotaExceeded?: boolean;
  isUserQuotaExceeded?: boolean;
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
      content: `Hey there! 🐹 I'm **Hamster AI**, your RepoHamster platform assistant for **${assignmentTitle}**.\n\nI can help you with:\n- 📋 **Platform Policies**: Assessment rules & PR evaluation workflow\n- 📦 **Repository & Test Cases**: How to access the repo, run public tests, and how hidden tests work\n- 💡 **General Coding Concepts**: Socratic debugging guidance and error concepts\n\n*(Note: To conserve tokens, I do not scan your entire codebase, and platform rules prevent me from writing solution code.)* What can I help you with?`,
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
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🛑 **Personal Daily AI Limit Reached!**\n\nYou've exhausted your personal daily Hamster AI allowance (${remainingRequests <= 0 ? 'request limit reached' : 'token budget spent'}). Take a pause to review your code and test assertions manually, or check back after your 24-hour rolling reset window!`,
          image: '/images/user-quota-exceeded.png',
          isUserQuotaExceeded: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isUserQuotaExceeded || res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `🛑 **Personal Daily Limit Reached!**\n\n${data.error || 'Your personal daily AI allowance has been exhausted.'}`,
              image: data.quotaImage || '/images/user-quota-exceeded.png',
              isUserQuotaExceeded: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        } else if (data.isPlatformQuotaExceeded) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: data.reply || data.error || 'Platform AI quota limit reached.',
              image: data.quotaImage || '/images/platform-quota-exceeded.png',
              isPlatformQuotaExceeded: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `⚠️ **Hamster Quota Alert**: ${data.error || 'Failed to generate response.'}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
        if (data.remainingRequests !== undefined) setRemainingRequests(data.remainingRequests);
        if (data.remainingTokens !== undefined) setRemainingTokens(data.remainingTokens);
      } else {
        if (data.isPlatformQuotaExceeded) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: data.reply,
              image: data.quotaImage || '/images/platform-quota-exceeded.png',
              isPlatformQuotaExceeded: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
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
        }
        if (data.remainingRequests !== undefined) setRemainingRequests(data.remainingRequests);
        if (data.remainingTokens !== undefined) setRemainingTokens(data.remainingTokens);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Network error communicating with the RepoHamster AI proxy.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-xl bg-card border border-purple-800/50 hover:border-brand-purple px-4 py-2.5 text-xs font-semibold text-white shadow-glow-purple transition"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-950/80">
          <HamsterMascot variant="thinking" size={18} />
        </span>
        <span>Ask Hamster AI</span>
        <span className="rounded-full bg-brand-purple/20 border border-brand-purple/40 px-2 py-0.5 text-[10px] font-mono text-brand-purple-light">
          {remainingRequests} left
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex h-full w-full max-w-lg flex-col border-l border-card-border bg-[#0a0d14] shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border p-4 bg-[#0e121d]">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-brand-purple/50">
                  <HamsterMascot variant="avatar" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <span>Hamster AI</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" />
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-brand-lime font-semibold">{remainingRequests} requests</span>
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
            <div className="border-b border-card-border/60 bg-purple-950/30 px-4 py-2 text-[11px] text-purple-200 flex items-center space-x-2 font-mono">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-lime" />
              <span>
                Socratic Mentorship: Explains architectural patterns and debugging clues without giving away solutions.
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                    {msg.role === 'user' ? (
                      <>
                        <span>You</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-brand-lime font-semibold">Hamster Coder</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.tokens && <span>({msg.tokens} tokens)</span>}
                      </>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[90%] ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none whitespace-pre-wrap'
                        : 'border border-card-border bg-[#131826] text-slate-200 rounded-tl-none font-sans'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      msg.content
                    )}

                    {msg.image && (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-card-border/80 bg-[#060810] shadow-2xl p-2 flex flex-col items-center">
                        <div className="w-full max-w-[340px] overflow-hidden rounded-xl bg-black/50 border border-card-border/50">
                          <img
                            src={msg.image}
                            alt={msg.isPlatformQuotaExceeded ? 'Platform AI Quota Overheated' : 'Personal Daily Quota Exhausted'}
                            className="w-full h-auto max-h-[420px] object-contain rounded-lg block mx-auto"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-2 text-center text-[10px] font-mono">
                          {msg.isPlatformQuotaExceeded ? (
                            <span className="text-amber-400 font-semibold flex items-center justify-center">
                              ⚡ Platform Quota Limit • Hamsters Refilling Token Pantry
                            </span>
                          ) : (
                            <span className="text-rose-400 font-semibold flex items-center justify-center">
                              ⏳ Personal Daily Allowance Exhausted • Resets in 24h
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-xs text-brand-lime p-2 font-mono">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-lime" />
                  <span>Hamster is analyzing your code inquiry...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="border-t border-card-border p-4 bg-[#0e121d]">
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
                      ? 'Ask about the bug symptoms, race condition, or architecture...'
                      : 'Daily AI credit budget exhausted'
                  }
                  disabled={loading || remainingRequests <= 0}
                  className="w-full resize-none rounded-xl border border-card-border bg-[#0a0d14] p-3 pr-12 text-xs text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || remainingRequests <= 0}
                  className="absolute bottom-3 right-3 rounded-lg bg-brand-lime p-1.5 text-slate-950 hover:bg-brand-lime-light transition disabled:opacity-30 shadow-glow-lime"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Enter to send, Shift+Enter for newline</span>
                <span>{remainingRequests} queries left today</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
