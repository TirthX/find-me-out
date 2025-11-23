import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tool = Database['public']['Tables']['tools']['Row'];

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  tools?: Tool[];
}

export function AISearchModal({ isOpen, onClose }: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: 'Hi! Tell me what you need, and I\'ll suggest the perfect AI tools for you. Try: "I need to make a presentation" or "I want to build a website"',
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    const userMessage = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setIsSearching(true);

    const matchedTools = await searchTools(userMessage);

    const response = generateResponse(userMessage, matchedTools);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: response,
          tools: matchedTools.slice(0, 5),
        },
      ]);
      setIsSearching(false);
    }, 800);
  };

  const searchTools = async (query: string): Promise<Tool[]> => {
    const lowerQuery = query.toLowerCase().trim();

    const { data: allTools } = await supabase
      .from('tools')
      .select('*');

    if (!allTools) return [];

    // Define keyword synonyms and categories
    const keywordMap: Record<string, string[]> = {
      website: ['website', 'web', 'site', 'webpage', 'webpage', 'landing page', 'portfolio'],
      presentation: ['presentation', 'slides', 'slide', 'pitch', 'deck', 'powerpoint', 'ppt'],
      automation: ['automation', 'automate', 'workflow', 'auto', 'bot', 'ai agent'],
      design: ['design', 'ui', 'ux', 'interface', 'visual', 'graphic', 'mockup', 'prototype'],
      code: ['code', 'coding', 'programming', 'developer', 'development', 'script', 'app'],
      writing: ['writing', 'write', 'content', 'article', 'blog', 'copy', 'text', 'document'],
      video: ['video', 'film', 'movie', 'youtube', 'edit', 'production', 'animation'],
      image: ['image', 'picture', 'photo', 'graphic', 'illustration', 'art', 'generate'],
      audio: ['audio', 'sound', 'music', 'podcast', 'voice', 'recording', 'edit'],
      resume: ['resume', 'cv', 'curriculum vitae', 'job application', 'career'],
      pdf: ['pdf', 'document', 'file', 'reader', 'viewer'],
      ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'chatbot'],
      seo: ['seo', 'search engine', 'optimization', 'ranking', 'keywords'],
      meeting: ['meeting', 'transcription', 'notes', 'summary', 'recording'],
    };

    // Score tools based on relevance
    const scored = allTools.map((tool) => {
      let score = 0;
      const toolName = tool.name.toLowerCase();
      const toolDesc = tool.description.toLowerCase();
      const toolTags = (tool.tags || []).join(' ').toLowerCase();
      const searchText = `${toolName} ${toolDesc} ${toolTags}`;

      // Check for exact name match (highest priority)
      if (toolName.includes(lowerQuery) || lowerQuery.includes(toolName.split(' ')[0])) {
        score += 50;
      }

      // Check keyword categories
      Object.entries(keywordMap).forEach(([category, keywords]) => {
        const hasCategoryKeyword = keywords.some(keyword => lowerQuery.includes(keyword));
        const hasToolKeyword = keywords.some(keyword => 
          searchText.includes(keyword) || toolTags.includes(keyword)
        );
        
        if (hasCategoryKeyword && hasToolKeyword) {
          score += 20;
        }
      });

      // Check for tag matches
      if (tool.tags && tool.tags.length > 0) {
        tool.tags.forEach(tag => {
          if (lowerQuery.includes(tag.toLowerCase())) {
            score += 15;
          }
        });
      }

      // Check for word matches in description
      const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 2);
      queryWords.forEach((word) => {
        if (searchText.includes(word)) {
          score += 5;
        }
        // Exact word match gets bonus
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        if (wordRegex.test(searchText)) {
          score += 3;
        }
      });

      // Boost trending tools slightly
      if (tool.is_trending) {
        score += 2;
      }

      return { tool, score };
    });

    // Filter, sort, and return top matches
    const results = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool);

    return results;
  };

  const generateResponse = (query: string, tools: Tool[]): string => {
    if (tools.length === 0) {
      const suggestions = [
        "I couldn't find any tools matching your request, but I'd be happy to help!",
        "I don't have any tools for that specific need in my database. Here are some suggestions:",
        "Unfortunately, I couldn't find exact matches for that query. Let me help you find something similar!"
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      return `${randomSuggestion}\n\n💡 Try searching for:\n• "website builder" or "build a site"\n• "video editing" or "create videos"\n• "design tools" or "graphic design"\n• "writing assistant" or "content creation"\n• "automation" or "workflow tools"\n\nOr browse the categories to discover amazing AI tools!`;
    }

    const count = Math.min(tools.length, 5);
    const responses = [
      `Great! I found ${count} excellent tool${count > 1 ? 's' : ''} for you:`,
      `Perfect! Here are ${count} tool${count > 1 ? 's' : ''} that match your needs:`,
      `Awesome! I've found ${count} relevant tool${count > 1 ? 's' : ''} for you:`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Tool Finder</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                {message.tools && message.tools.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.tools.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-white dark:bg-gray-600 rounded-xl hover:shadow-lg transition-all border border-gray-200 dark:border-gray-500 hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                              {tool.description}
                            </div>
                            {tool.tags && tool.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {tool.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-blue-500 dark:text-blue-400 text-xs font-medium whitespace-nowrap">
                            Visit →
                          </div>
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

        <form onSubmit={handleSearch} className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
