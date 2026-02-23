import { motion } from 'framer-motion';
import { Shield, PenLine } from 'lucide-react';

const Hero = ({ onConfessClick, confessionCount }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-4"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <span className="text-sm text-dark-muted font-medium tracking-wider uppercase">
          100% Anonymous
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
        Speak Your Truth,{' '}
        <span className="text-accent">Stay Anonymous</span>
      </h1>

      <p className="text-dark-muted text-lg max-w-xl mx-auto mb-8">
        Share your confessions freely. No names, no judgments — just honest words
        from real hearts.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConfessClick}
        className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-dark-bg font-semibold rounded-xl shadow-lg shadow-accent/20 transition-colors cursor-pointer"
      >
        <PenLine className="w-5 h-5" />
        Write a Confession
      </motion.button>

      {confessionCount > 0 && (
        <p className="mt-6 text-sm text-dark-muted">
          <span className="text-accent font-semibold">{confessionCount}</span>{' '}
          confession{confessionCount !== 1 ? 's' : ''} shared so far
        </p>
      )}
    </motion.section>
  );
};

export default Hero;
