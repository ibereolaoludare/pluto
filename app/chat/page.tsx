"use client";

import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { FormattedText } from "@/components/ui/formatted-text";
import { useSearchParams } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type GeminiHistoryItem = {
  role: "user" | "model";
  parts: { text: string }[];
};

type GeminiApiResponse = {
  text?: string;
  history?: GeminiHistoryItem[];
  error?: string;
};

export default function ChatPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeminiHistoryItem[]>([]);

  useEffect(() => {
    // Load initial question from query params if present
    const initialQuestion = searchParams.get("q");
    if (initialQuestion) {
      setInputValue(decodeURIComponent(initialQuestion));
    }
  }, [searchParams]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = inputValue.trim();

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

    const nextHistory: GeminiHistoryItem[] = [
      ...history,
      { role: "user", parts: [{ text: messageText }] },
    ];

    try {
      setHistory(nextHistory);
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: nextHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Gemini request failed");
      }

      const data = (await response.json()) as GeminiApiResponse;
      const aiText = data.text?.trim() || "I could not generate a response.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setHistory(
        data.history ?? [
          ...nextHistory,
          { role: "model", parts: [{ text: aiText }] },
        ]
      );
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? `There was an error contacting Gemini: ${error.message}`
            : "There was an error contacting Gemini.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-background via-background to-slate-100 dark:to-purple-950/10">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-8 lg:py-12 max-w-5xl mx-auto w-full">
        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 w-full max-w-3xl overflow-y-auto space-y-6 mb-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-slate-500 dark:text-purple-300/60">
                Start a conversation by typing a question below...
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-20 duration-1000`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white dark:bg-purple-600"
                    : "bg-slate-100 border border-purple-500/20 text-slate-800 dark:bg-purple-950/40 dark:border-purple-500/20 dark:text-purple-50"
                }`}
              >
                {message.role === "assistant" ? (
                  <FormattedText text={message.content} />
                ) : (
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-20 duration-2000">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 bg-slate-100 border border-slate-200 dark:bg-purple-950/40 dark:border-purple-500/20">
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-slate-500 dark:bg-purple-400 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="size-2 rounded-full bg-slate-500 dark:bg-purple-400 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="size-2 rounded-full bg-slate-500 dark:bg-purple-400 animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Section - Fixed at bottom */}
        <div className="w-full max-w-3xl sticky bottom-0 pb-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-2 sm:gap-3 items-end">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything or give a detailed prompt..."
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 pl-4 pr-20 sm:pr-24 rounded-2xl border-slate-200 bg-white backdrop-blur-sm focus-visible:border-purple-500/60 focus-visible:ring-slate-300 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 dark:border-purple-500/30 dark:bg-purple-950/30 dark:focus-visible:border-purple-500/60 dark:focus-visible:ring-purple-500/20 dark:text-purple-50 dark:placeholder:text-purple-300/40"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 space-x-2 items-center">
                  <kbd className="pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-slate-200 bg-white px-2 font-mono text-[10px] font-medium text-slate-600 shadow-sm dark:border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-300/60">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-purple-600 text-white hover:bg-slate-800 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
