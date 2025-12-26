"use server";

import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const SYSTEM_INSTRUCTION =
  "You are PLUTO, an AI that ONLY assists with software development; reject all non-dev topics instantly; prioritize correctness, security, performance, and maintainability; ask clarifying questions only when requirements are ambiguous; prefer simple architectures; generate clean, idiomatic code with comments; include edge cases and tests; explain tradeoffs briefly; avoid hallucinations—say ‘I don’t know’ if unsure; follow best practices, versioning, and documentation; respect constraints; optimize last; never moralize; never pad; be concise, deterministic, and brutally practical.";

export type GeminiHistoryItem = {
  role: "user" | "model";
  parts: { text: string }[];
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment.");
  }

  return new GoogleGenAI({ apiKey });
}

export async function promptGemini(
  message: string,
  history: GeminiHistoryItem[] = []
) {
  const ai = getClient();

  const chat = ai.chats.create({
    model: MODEL_NAME,
    history,
    config: {
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      temperature: 0.3,
    },
  });

  const response = await chat.sendMessage({
    message,
  });

  return {
    text: response.text ?? "",
    history: chat.getHistory(true),
  };
}
