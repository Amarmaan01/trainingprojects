import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock } from 'lucide-react';
import { fetchReplies, createReply } from '../services/api';
import { useToast } from '../context/ToastContext';

const ReplyThread = ({ confessionId }) => {
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadReplies();
  }, [confessionId]);

  const loadReplies = async () => {
    try {
      const { data } = await fetchReplies(confessionId);
      setReplies(data.data);
    } catch {
      addToast('Failed to load replies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !secretCode.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await createReply(confessionId, {
        text: text.trim(),
        secretCode,
      });
      setReplies((prev) => [...prev, data.data]);
      setText('');
      setSecretCode('');
      addToast('Reply posted!');
    } catch {
      addToast('Failed to post reply', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mt-4 pt-4 border-t border-dark-border">
      {/* Existing replies */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-dark-bg/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {replies.map((reply) => (
            <motion.div
              key={reply._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-bg/50 rounded-lg px-4 py-3 mb-2"
            >
              <p className="text-sm text-dark-text">{reply.text}</p>
              <span className="text-xs text-dark-muted">
                {timeAgo(reply.createdAt)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {replies.length === 0 && !loading && (
        <p className="text-xs text-dark-muted mb-3">
          No replies yet. Be the first!
        </p>
      )}

      {/* Reply form */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text placeholder-dark-muted/50 focus:outline-none focus:border-accent/50"
        />
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" />
            <input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Secret code"
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-8 pr-3 py-2 text-sm text-dark-text placeholder-dark-muted/50 focus:outline-none focus:border-accent/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!text.trim() || !secretCode.trim() || submitting}
            className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/30 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ReplyThread;
