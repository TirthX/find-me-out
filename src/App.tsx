import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { AISearchModal } from './components/AISearchModal';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header isDark={isDark} onToggleDark={toggle} />
      <Hero onSearchClick={() => setIsSearchModalOpen(true)} />
      <CategoriesSection />
      <AISearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}

export default App;
