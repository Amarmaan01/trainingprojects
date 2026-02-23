import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Clock, Lock } from 'lucide-react';

const EXPIRY_OPTIONS = [
  { value: 'permanent', label: 'Permanent' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

const ConfessionForm = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [expiry, setExpiry] = useState('permanent');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !secretCode.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ text: text.trim(), secretCode, expiry });
      setText('');
      setSecretCode('');
      setExpiry('permanent');
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark-text">
                Write Your Confession
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-dark-border/50 text-dark-muted hover:text-dark-text transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Confession text */}
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Pour your heart out... (min 10 characters)"
                  rows={5}
                  maxLength={5000}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text placeholder-dark-muted/50 focus:outline-none focus:border-accent/50 resize-none transition-colors"
                />
                <p className="text-xs text-dark-muted mt-1 text-right">
                  {text.length}/5000
                </p>
              </div>

              {/* Secret code */}
              <div>
                <label className="flex items-center gap-1.5 text-sm text-dark-muted mb-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Secret Code (to edit/delete later)
                </label>
                <input
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Enter a secret code (min 4 chars)"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text placeholder-dark-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="flex items-center gap-1.5 text-sm text-dark-muted mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Auto-delete after
                </label>
                <div className="flex gap-2 flex-wrap">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiry(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                        expiry === opt.value
                          ? 'bg-accent/20 text-accent border border-accent/40'
                          : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={text.trim().length < 10 || secretCode.length < 4 || loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-dark-bg font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Posting...' : 'Post Anonymously'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfessionForm;
