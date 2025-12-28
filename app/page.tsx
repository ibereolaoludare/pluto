"use client";

import Header from "@/components/ui/header";
import { AuroraText } from "@/components/ui/aurora-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Zap, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = inputValue.trim();
    if (!messageText) return;

    router.push(`/chat?q=${encodeURIComponent(messageText)}`);
  };
  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-background via-background to-slate-100 dark:to-purple-950/10">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-12 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="flex-col flex items-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-20 duration-300">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-center">
              The best{" "}
              <AuroraText speed={2} colors={["purple", "pink"]}>
                Artificial Intelligence
              </AuroraText>{" "}
              for software development.
            </h1>
            <p className="text-base sm:text-lg max-w-2xl text-slate-600 dark:text-purple-200/80 text-center mx-auto px-4">
              Get instant, intelligent responses powered by advanced AI. Ask
              anything about code, architecture, or best practices.
            </p>
          </div>

          {/* Suggested Questions */}
          <div className="w-full max-w-3xl mt-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-purple-300/60 mb-4 text-center">
              Try asking about...
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => {
                const Icon = question.icon;
                return (
                  <Link
                    key={index}
                    href={`/chat?q=${encodeURIComponent(question.text)}`}
                    className="group relative flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 dark:border-purple-500/20 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 dark:hover:border-purple-500/40 transition-all duration-200 text-left shadow-sm dark:shadow-none"
                  >
                    <div className="shrink-0 mt-0.5">
                      <Icon className="size-5 text-slate-600 group-hover:text-slate-800 dark:text-purple-400 dark:group-hover:text-purple-300 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 group-hover:text-slate-900 dark:text-purple-100/90 dark:group-hover:text-purple-50 transition-colors line-clamp-2">
                        {question.text}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-purple-400/60 mt-1 inline-block">
                        {question.category}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Chat Input Section */}
          <div className="w-full max-w-3xl mt-12">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-2 sm:gap-3 items-end">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const syntheticEvent = {
                          preventDefault: () => {},
                        } as React.FormEvent;
                        handleSubmit(syntheticEvent);
                      }
                    }}
                    placeholder="Ask anything or give a detailed prompt..."
                    className="w-full h-12 sm:h-14 pl-4 sm:pr-24 rounded-2xl border-slate-200 bg-white backdrop-blur-sm focus-visible:border-purple-500/60 focus-visible:ring-slate-300 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 dark:border-purple-500/30 dark:bg-purple-950/30 dark:focus-visible:border-purple-500/60 dark:focus-visible:ring-purple-500/20 dark:text-purple-50 dark:placeholder:text-purple-300/40"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 space-x-2 items-center">
                    <kbd className="pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-slate-200 bg-white px-2 font-mono text-[10px] font-medium text-slate-600 shadow-sm dark:border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-300/60">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                    <kbd className="pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-slate-200 bg-white px-2 font-mono text-[10px] font-medium text-slate-600 shadow-sm dark:border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-300/60">
                      /
                    </kbd>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim()}
                  className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="size-4 sm:size-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
