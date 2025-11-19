"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
// import type { Recommendation } from "@/lib/recommendationEngine";
// import { buildLLMPrompt } from "@/lib/promptBuilder";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export default function LLMChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !recommendations.length) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const prompt = buildLLMPrompt({
        userId: "user123",
        topCategories: Array.from(
          new Set(recommendations.map((r) => r.product.category))
        ),
        recommendations,
        userQuestion: userMessage.text,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123",
          recommendations,
          userQuestion: userMessage.text,
        }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.response || "No response",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 text-slate-300 max-h-[400px] overflow-y-auto flex flex-col">
      <div className="flex-1 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xl ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-slate-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></span>
            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></span>
            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product..."
          className="flex-1 border border-gray-600 rounded-full px-4 py-2 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || !recommendations.length}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading || !recommendations.length}
        >
          →
        </button>
      </form>
    </div>
  );
}
