import { useEffect, useState } from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tool = Database['public']['Tables']['tools']['Row'];

export function TrendingSection() {
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingTools();
  }, []);

  const loadTrendingTools = async () => {
    const { data } = await supabase
      .from('tools')
      .select('*')
      .eq('is_trending', true)
      .limit(6);

    if (data) {
      setTrendingTools(data);
    }
    setLoading(false);
  };

  if (loading || trendingTools.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 mb-12">
          <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Trending This Week
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool, index) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {tool.description}
              </p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              >
                Check it out
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
