import { NextRequest, NextResponse } from "next/server";
import { retrieveKnowledge } from "@/lib/chatbot-rag";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = body.messages ?? [];

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!lastUserMessage?.content) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  const knowledgeContext = await retrieveKnowledge(lastUserMessage.content);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "groq/compound",
      temperature: 0.35,
      max_completion_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "You are Amirul Fariz's portfolio assistant. Answer in a helpful, concise, friendly way. Only claim facts that are supported by the provided knowledge context. If the information is missing, say you do not have enough information yet and invite the user to ask Amirul directly.",
        },
        {
          role: "system",
          content: `Knowledge context:\n\n${knowledgeContext || "No knowledge context available."}`,
        },
        ...messages.slice(-8),
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Groq request failed.", details: errorText },
      { status: response.status },
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();

  return NextResponse.json({
    answer: content || "I couldn't generate a reply just now. Please try again.",
  });
}
