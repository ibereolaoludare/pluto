"use client";

import Header from "@/components/ui/header";
import { AuroraText } from "@/components/ui/aurora-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Send, Sparkles, Code, Zap, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  {
    icon: Code,
    text: "How do I implement authentication in Next.js?",
    category: "Next.js",
  },
  {
    icon: Sparkles,
    text: "Explain React Server Components",
    category: "React",
  },
  {
    icon: Zap,
    text: "Best practices for API routes in Next.js",
    category: "Best Practices",
  },
  {
    icon: MessageSquare,
    text: "How to optimize performance in React apps?",
    category: "Performance",
  },
];

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Focus input on "/" when not already focused on an input
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, question?: string) => {
    e.preventDefault();
    const messageText = question || inputValue.trim();

    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'd be happy to help you with "${messageText}". This is a demo response. In a real implementation, this would connect to an AI API to provide intelligent answers to your questions.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-purple-950/10">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-8 lg:py-12 max-w-5xl mx-auto w-full">
        {messages.length === 0 ? (
          <>
            {/* Hero Section */}
            <div className="flex-col flex items-center space-y-6 mb-12 animate-in fade-in duration-500">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-center">
                  The best{" "}
                  <AuroraText speed={2} colors={["purple", "pink"]}>
                    Artificial Intelligence
                  </AuroraText>{" "} for software development.
                </h1>
                <p className="text-base sm:text-lg max-w-2xl text-purple-200/80 text-center mx-auto px-4">
                  Get instant, intelligent responses powered by advanced AI. Ask
                  anything about code, architecture, or best practices.
                </p>
              </div>

              {/* Suggested Questions */}
              <div className="w-full max-w-3xl mt-8">
                <h2 className="text-sm font-semibold text-purple-300/60 mb-4 text-center">
                  Try asking about...
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedQuestions.map((question, index) => {
                    const Icon = question.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question.text)}
                        className="group relative flex items-start gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-950/20 hover:bg-purple-950/40 hover:border-purple-500/40 transition-all duration-200 text-left"
                      >
                        <div className="shrink-0 mt-0.5">
                          <Icon className="size-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-purple-100/90 group-hover:text-purple-50 transition-colors line-clamp-2">
                            {question.text}
                          </p>
                          <span className="text-xs text-purple-400/60 mt-1 inline-block">
                            {question.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 w-full max-w-3xl overflow-y-auto space-y-6 mb-6 scroll-smooth"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-950/40 border border-purple-500/20 text-purple-50"
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 bg-purple-950/40 border border-purple-500/20">
                    <div className="flex gap-1.5">
                      <span className="size-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="size-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="size-2 rounded-full bg-purple-400 animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Chat Input Section - Fixed at bottom */}
        <div className="w-full max-w-3xl sticky bottom-0 pb-4">
          <form onSubmit={(e) => handleSubmit(e)} className="relative">
            <div className="flex gap-2 sm:gap-3 items-end">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 pl-4 pr-20 sm:pr-24 rounded-2xl border-purple-500/30 bg-purple-950/30 backdrop-blur-sm focus-visible:border-purple-500/60 focus-visible:ring-purple-500/20 text-sm sm:text-base placeholder:text-purple-300/40"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-purple-500/30 bg-purple-950/50 px-2 font-mono text-[10px] font-medium text-purple-300/60">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-foreground hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="size-4 sm:size-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
