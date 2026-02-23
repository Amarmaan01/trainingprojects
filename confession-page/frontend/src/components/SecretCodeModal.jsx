import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertTriangle } from 'lucide-react';

const SecretCodeModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmLabel = 'Confirm',
  danger = false,
  showTextInput = false,
  currentText = '',
}) => {
  const [secretCode, setSecretCode] = useState('');
  const [newText, setNewText] = useState(currentText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!secretCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (showTextInput) {
        await onConfirm(secretCode, newText);
      } else {
        await onConfirm(secretCode);
      }
      setSecretCode('');
      setNewText('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid secret code');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="glass-card w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
              {danger && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-dark-border/50 text-dark-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {danger && (
            <p className="text-sm text-red-400/80 mb-4">
              This action cannot be undone. All replies will also be deleted.
            </p>
          )}

          {showTextInput && (
            <div className="mb-4">
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={4}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-accent/50 resize-none"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-sm text-dark-muted mb-1.5">
              <Lock className="w-3.5 h-3.5" />
              Enter your secret code
            </label>
            <input
              type="password"
              value={secretCode}
              onChange={(e) => {
                setSecretCode(e.target.value);
                setError('');
              }}
              placeholder="Your secret code"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text placeholder-dark-muted/50 focus:outline-none focus:border-accent/50"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-dark-muted hover:text-dark-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!secretCode.trim() || loading}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                danger
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-accent text-dark-bg hover:bg-accent-hover'
              }`}
            >
              {loading ? 'Verifying...' : confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecretCodeModal;
