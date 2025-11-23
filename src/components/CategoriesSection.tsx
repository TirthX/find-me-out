import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { CategoryModal } from './CategoryModal';
import { AddToolModal } from './AddToolModal';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleAddToolSuccess = () => {
    // Optionally refresh categories or show success message
    // Categories don't need to be refreshed, but tools will be loaded when category modal opens
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Browse by Category
              </h2>
            </div>
            <button
              onClick={() => setIsAddToolModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all self-center sm:self-auto"
            >
              <Plus className="w-5 h-5" />
              Add AI Tool
            </button>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Click any category to explore curated AI tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />
      <AddToolModal
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        onSuccess={handleAddToolSuccess}
      />
    </>
  );
}
