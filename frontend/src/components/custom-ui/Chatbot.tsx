"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: boolean;
  streaming?: boolean;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I’m your flight reviews assistant. Ask me about trends, sentiment, or specific airlines.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSend = () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    // Simulated assistant response with thinking and typewriter streaming
    const thinkingId = crypto.randomUUID();
    const thinkingMsg: Message = {
      id: thinkingId,
      role: "assistant",
      content: "",
      thinking: true,
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    const fullText =
      "(Demo) I’ll analyze that once connected to an LLM. Try asking: ‘Show monthly sentiment for British Airways.’";

    // After a short delay, replace thinking with a streaming message
    setTimeout(() => {
      const streamId = crypto.randomUUID();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { id: streamId, role: "assistant", content: "", streaming: true }
            : m
        )
      );

      let i = 0;
      const tick = 18; // ms per char for typewriter effect
      const interval = setInterval(() => {
        i = Math.min(i + 1, fullText.length);
        const slice = fullText.slice(0, i);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, content: slice, streaming: i < fullText.length } : m
          )
        );
        if (i >= fullText.length) clearInterval(interval);
      }, tick);
    }, 500);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) return; // allow multiline in future
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Launcher Button */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <i className="fas fa-comments text-lg" />
        <span className="hidden sm:block font-medium">Chat</span>
      </button>

      {/* Chat Window */}
      <div
        ref={containerRef}
        className={`fixed bottom-20 right-3 z-50 w-[92vw] max-w-[380px] h-[520px] transform ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        } transition-all duration-200 ease-out`}
      >
        <div className="h-full flex flex-col rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-[var(--dark-mode-text)] border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-robot" />
              </div>
              <div>
                <div className="text-sm font-semibold">Flightly Assistant</div>
                <div className="text-[11px] opacity-80">Ask about reviews & trends</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 rounded-md hover:bg-white/10"
                aria-label="Minimize"
                onClick={() => setOpen(false)}
              >
                <i className="fas fa-chevron-down" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-auto p-3 space-y-3 scrollbar-thin bg-gray-50 dark:bg-gray-900/40"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-[var(--dark-mode-text)]"
                  } px-3 py-2 rounded-lg max-w-[80%] text-sm shadow`}
                >
                  {m.thinking ? (
                    <span className="text-gray-600 dark:text-gray-300 animate-pulse">Thinking…</span>
                  ) : (
                    <>
                      {m.content}
                      {m.streaming && <span className="opacity-50 animate-pulse">▍</span>}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about airlines, routes, sentiment…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-[var(--dark-mode-text)] placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={`px-3 py-2 rounded-md text-white shadow ${
                  canSend
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
