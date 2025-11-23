import { ExternalLink } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Tool = Database['public']['Tables']['tools']['Row'];

interface ToolCardProps {
  tool: Tool;
  index: number;
  totalCards: number;
  isRevealed: boolean;
  categoryColor: string;
}

export function ToolCard({ tool, index, totalCards, isRevealed, categoryColor }: ToolCardProps) {
  const baseDelay = index * 60;
  const stackOffset = isRevealed ? 0 : (totalCards - index - 1) * 4;
  const translateY = isRevealed ? index * 120 : stackOffset;
  const opacity = isRevealed ? 1 : 0.3 + (index / totalCards) * 0.7;
  const scale = isRevealed ? 1 : 1 - (totalCards - index - 1) * 0.02;
  const rotate = isRevealed ? (index % 2 === 0 ? -1 : 1) * (Math.random() * 2) : 0;

  return (
    <div
      className="absolute top-0 left-0 w-full transition-all duration-500 ease-out"
      style={{
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        transitionDelay: isRevealed ? `${baseDelay}ms` : '0ms',
        zIndex: isRevealed ? totalCards - index : index,
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
              {tool.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
              {tool.description}
            </p>
            {tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: categoryColor }}
        >
          Open Tool
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
