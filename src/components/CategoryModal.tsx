import { useState, useEffect } from 'react';
import { X, ExternalLink, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PasswordPromptModal } from './PasswordPromptModal';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type Tool = Database['public']['Tables']['tools']['Row'];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      loadTools();
    } else {
      setTools([]);
    }
  }, [isOpen, category]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const loadTools = async () => {
    if (!category) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('tools')
      .select('*')
      .eq('category_id', category.id)
      .order('order', { ascending: true });

    if (data) {
      setTools(data);
    }
    setLoading(false);
  };

  const handleDeleteClick = (tool: Tool) => {
    setToolToDelete(tool);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = async () => {
    if (!toolToDelete) return;

    setDeleting(true);
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', toolToDelete.id);

    if (error) {
      console.error('Error deleting tool:', error);
      setDeleting(false);
      return;
    }

    // Reload tools after deletion
    await loadTools();
    setToolToDelete(null);
    setDeleting(false);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setToolToDelete(null);
  };

  if (!isOpen || !category) return null;

  const IconComponent = (Icons as any)[category.icon] || Icons.Folder;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {category.description}
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

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tools...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No tools found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full font-medium"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {tool.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full text-gray-500 dark:text-gray-400">
                          +{tool.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      Open Tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteClick(tool)}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSuccess={handlePasswordSuccess}
        action="delete"
      />
    </div>
  );
}

