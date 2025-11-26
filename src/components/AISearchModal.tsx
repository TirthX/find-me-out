import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Loader } from "lucide-react";
import { supabase } from "../lib/supabase"; // Ensure this client is set up correctly
import type { Database } from "../lib/database.types";

type Tool = Database["public"]["Tables"]["tools"]["Row"];

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: "user" | "assistant";
  content: string;
  tools?: Tool[];
}

export function AISearchModal({ isOpen, onClose }: AISearchModalProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "assistant",
      content:
        'Hi! I can find the perfect tool for any task. Try asking: "I need to design a logo" or "Help me automate my emails".',
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    const userMessage = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsSearching(true);

    try {
      // Call the Edge Function "search-tools"
      const { data, error } = await supabase.functions.invoke("search-tools", {
        body: { query: userMessage },
      });

      if (error) throw error;

      const matchedTools = data.tools || [];
      const response = generateResponse(matchedTools);

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: response,
          tools: matchedTools,
        },
      ]);
    } catch (error) {
      console.error("Search error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "I'm having trouble connecting to my brain right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const generateResponse = (tools: Tool[]): string => {
    if (tools.length === 0) {
      return "I couldn't find a tool that matches that description perfectly. \n\nCould you try rephrasing your request? (e.g., instead of 'make visual', try 'create images')";
    }

    const count = tools.length;
    const responses = [
      `I found ${count} tools that are perfect for this:`,
      `Here are the top ${count} AI tools for your request:`,
      `I've selected these ${count} tools to help you out:`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Tool Finder
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Vector Search
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
                {message.tools && message.tools.length > 0 && (
                  <div className="mt-4 grid gap-3">
                    {message.tools.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-gray-600 hover:border-blue-400 group"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {tool.name}
                            </span>
                            <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              Visit Site &rarr;
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {tool.description}
                          </p>
                          {tool.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tool.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isSearching && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                <Loader className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSearch}
          className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-3xl"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for any tool (e.g. 'I need to edit a PDF')..."
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}