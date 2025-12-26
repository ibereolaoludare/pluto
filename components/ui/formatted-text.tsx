"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
  Highlight,
  themes,
  type Language,
  type RenderProps,
} from "prism-react-renderer";

type FormattedTextProps = {
  text: string;
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type PrismToken = {
  types: string[];
  content: string;
  empty?: boolean;
};

// Use RenderProps type from prism-react-renderer to match the library's signatures

function CodeBlock({ inline, className, children }: CodeProps) {
  const match = /language-([\w-]+)/.exec(className ?? "");
  const code = String(children).replace(/\n$/, "");

  if (inline) {
    return (
      <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em] dark:bg-purple-950/50">
        {children}
      </code>
    );
  }

  const lang = (match?.[1] as Language) || "tsx";

  return (
    <Highlight code={code} language={lang} theme={themes.github}>
      {({
        className: cls,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }: RenderProps) => (
        <code className={cls} style={style}>
          {tokens.map((line: PrismToken[], i: number) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token: PrismToken, key: number) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
}

export function FormattedText({ text }: FormattedTextProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        code: CodeBlock,
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-purple-500/20 dark:bg-purple-950/30">
            {children}
          </pre>
        ),
        a: ({ children, ...props }) => (
          <a
            {...props}
            className="underline text-blue-600 hover:text-blue-700 dark:text-purple-300 dark:hover:text-purple-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-1">{children}</ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 pl-3 italic text-slate-600 dark:text-purple-200/80">
            {children}
          </blockquote>
        ),
        h1: ({ children }) => (
          <h1 className="text-xl font-semibold mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mb-2">{children}</h3>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        th: (props) => (
          <th
            className="border-b border-slate-200 px-2 py-1 font-medium dark:border-purple-500/30"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="border-b border-slate-100 px-2 py-1 dark:border-purple-500/20"
            {...props}
          />
        ),
        p: ({ children }) => (
          <p className="text-sm sm:text-base leading-relaxed">{children}</p>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
