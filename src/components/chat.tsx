"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Does Celine even need one?",
  "What color should we get?",
  "Is this tax deductible?",
  "What would her mom think?",
  "Can we gift wrap it?",
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    setInput("");
    setError(null);
    const newMessages: Message[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <p className="text-sm text-center text-yellow-300">
        Discuss the matter
      </p>

      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto bg-black/60 border-2 border-[#00ff00] rounded p-3 space-y-2 text-sm"
      >
        {messages.length === 0 && (
          <p className="text-gray-500 italic text-center text-xs">Say something...</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-cyan-300" : "text-[#00ff00]"}>
            <span className="font-bold">{m.role === "user" ? "you" : "bot"}: </span>
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-[#00ff00]">
            <span className="font-bold">bot: </span>
            <span className="blink">...</span>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs bg-black/40 border border-[#00ff00]/40 text-[#00ff00] rounded-full px-3 py-1.5 hover:bg-[#00ff00]/10 hover:border-[#00ff00] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          maxLength={200}
          className="flex-1 bg-black/60 border-2 border-[#00ff00] rounded px-3 py-2 text-white text-sm outline-none focus:border-[#00ffff] placeholder-gray-600"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="retro-btn bg-[#00ff00] text-black font-bold px-4 py-2 text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
