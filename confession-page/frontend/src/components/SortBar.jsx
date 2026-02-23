import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'mostLoved', label: 'Most Loved' },
  { value: 'trending', label: 'Trending' },
];

const SortBar = ({ activeSort, onSortChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {SORT_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSortChange(option.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            activeSort === option.value
              ? 'bg-accent text-dark-bg'
              : 'bg-dark-card border border-dark-border text-dark-muted hover:text-dark-text hover:border-dark-muted'
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
};

export default SortBar;
