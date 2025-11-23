import { useState, useEffect } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PasswordPromptModal } from './PasswordPromptModal';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddToolModal({ isOpen, onClose, onSuccess }: AddToolModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      resetForm();
    } else {
      // Reset password verification when modal closes
      setPasswordVerified(false);
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (data) {
      setCategories(data);
      if (data.length > 0 && !categoryId) {
        setCategoryId(data[0].id);
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setUrl('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setError('');
    setSuccess(false);
    setPasswordVerified(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!name.trim()) {
      setError('Tool name is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!url.trim()) {
      setError('Tool URL is required');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    // Check if password is verified, if not, show password modal
    if (!passwordVerified) {
      setIsPasswordModalOpen(true);
      return;
    }

    // Proceed with submission
    await submitTool();
  };

  const handlePasswordSuccess = () => {
    setPasswordVerified(true);
    setIsPasswordModalOpen(false);
    // Automatically submit after password verification
    submitTool();
  };

  const submitTool = async () => {
    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('tools')
        .insert([
          {
            name: name.trim(),
            description: description.trim(),
            url: url.trim(),
            category_id: categoryId,
            tags: [],
            is_trending: false,
            order: 0,
          },
        ]);

      if (insertError) {
        setError(insertError.message || 'Failed to add tool. Please try again.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      resetForm();

      // Call onSuccess callback after a short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }, 1500);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add AI Tool</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a new tool to the collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="tool-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tool Name <span className="text-red-500">*</span>
              </label>
              <input
                id="tool-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ChatGPT, Midjourney, Notion AI"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <label
                htmlFor="tool-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tool-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this tool does..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <label
                htmlFor="tool-url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tool URL <span className="text-red-500">*</span>
              </label>
              <input
                id="tool-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <label
                htmlFor="tool-category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              {loading ? (
                <div className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Loading categories...</span>
                </div>
              ) : (
                <select
                  id="tool-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all text-gray-900 dark:text-white"
                  disabled={submitting || categories.length === 0}
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Tool added successfully! Closing...
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : success ? (
                'Added!'
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Tool
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
        action="add"
      />
    </div>
  );
}

