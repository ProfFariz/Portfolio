"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, MessageCircleMore, SendHorizonal, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatbotWidgetProps = {
  triggerClassName: string;
  triggerLabel: string;
  triggerContent?: ReactNode;
};

export function ChatbotWidget({
  triggerClassName,
  triggerLabel,
  triggerContent,
}: ChatbotWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Amirul's portfolio assistant. I can only answer questions about Amirul, his background, skills, projects, and contact information.",
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, messages, isLoading]);

  const submitMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ||
            data.error ||
            "I couldn't respond right now. Please try again in a moment.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "The chat request failed. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMessage();
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submitMessage();
    }
  };

  const chatPanel = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[100] flex h-[32rem] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--popover)_92%,transparent)] shadow-2xl shadow-[color:color-mix(in_oklab,var(--foreground)_18%,transparent)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[color:color-mix(in_oklab,var(--primary)_12%,var(--background))] text-[color:var(--primary)]">
                <MessageCircleMore className="size-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold">Ask Amirul</p>
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  Portfolio assistant powered by Groq
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition-colors duration-200 hover:text-[color:var(--foreground)]"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                      : "border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)] text-[color:var(--foreground)]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-3xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)] px-4 py-3 text-sm text-[color:var(--muted-foreground)]">
                  <LoaderCircle className="size-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[color:var(--border)] px-4 py-4"
          >
            <div className="flex items-end gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_76%,transparent)] p-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Amirul, his skills, or projects..."
                rows={1}
                className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex size-11 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-[color:var(--primary-foreground)] disabled:opacity-60"
                aria-label="Send message"
              >
                <SendHorizonal className="size-4" />
              </button>
            </div>
          </form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
        aria-label={triggerLabel}
        title={triggerLabel}
      >
        {triggerContent ?? triggerLabel}
      </button>

      {isMounted ? createPortal(chatPanel, document.body) : null}
    </>
  );
}
