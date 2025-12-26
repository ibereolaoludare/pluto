import { NextResponse } from "next/server";
import {
  promptGemini,
  type GeminiHistoryItem,
} from "@/components/server/gemini-caller";

export async function POST(request: Request) {
  try {
    const { message, history } = (await request.json()) as {
      message?: string;
      history?: GeminiHistoryItem[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A message string is required." },
        { status: 400 }
      );
    }

    const result = await promptGemini(message, history ?? []);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini API request failed", error);
    return NextResponse.json(
      { error: "Unable to process the request right now." },
      { status: 500 }
    );
  }
}
