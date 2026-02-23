import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ThumbsUp,
  Laugh,
  MessageCircle,
  Edit3,
  Trash2,
  Clock,
} from 'lucide-react';
import { addReaction } from '../services/api';
import { useToast } from '../context/ToastContext';
import ReplyThread from './ReplyThread';
import SecretCodeModal from './SecretCodeModal';

const SENTIMENT_CONFIG = {
  Happy: { emoji: '😊', class: 'badge-happy' },
  Sad: { emoji: '😢', class: 'badge-sad' },
  Romantic: { emoji: '💕', class: 'badge-romantic' },
  Funny: { emoji: '😂', class: 'badge-funny' },
  Regret: { emoji: '😔', class: 'badge-regret' },
  Neutral: { emoji: '🤔', class: 'badge-neutral' },
};

const ConfessionCard = ({ confession, onUpdate, onDelete, onReactionUpdate }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userReactions, setUserReactions] = useState(
    confession.userReactions || { like: false, love: false, laugh: false }
  );
  const { addToast } = useToast();

  const sentiment = SENTIMENT_CONFIG[confession.sentiment] || SENTIMENT_CONFIG.Neutral;

  const handleReaction = async (type) => {
    if (userReactions[type]) {
      addToast(`You already reacted with ${type}`, 'info');
      return;
    }
    setAnimatingReaction(type);
    try {
      const { data } = await addReaction(confession._id, type);
      onReactionUpdate(confession._id, data.data.reactions);
      setUserReactions(data.data.userReactions);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reaction failed';
      addToast(msg, 'error');
    }
    setTimeout(() => setAnimatingReaction(null), 300);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-card p-5 mb-4"
      >
        {/* Header: sentiment + time */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sentiment.class}`}
          >
            {sentiment.emoji} {confession.sentiment}
          </span>
          <div className="flex items-center gap-1 text-xs text-dark-muted">
            <Clock className="w-3 h-3" />
            {timeAgo(confession.createdAt)}
          </div>
        </div>

        {/* Confession text */}
        <p className="text-dark-text leading-relaxed mb-4 whitespace-pre-wrap">
          {confession.text}
        </p>

        {/* Expiry notice */}
        {confession.expiryDate && (
          <p className="text-xs text-dark-muted mb-3 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expires {timeAgo(confession.expiryDate).replace('ago', 'from now')}
          </p>
        )}

        {/* Actions row */}
        <div className="flex items-center justify-between border-t border-dark-border pt-3">
          {/* Reactions */}
          <div className="flex items-center gap-3">
            <ReactionButton
              icon={<ThumbsUp className="w-4 h-4" />}
              count={confession.reactions?.like || 0}
              onClick={() => handleReaction('like')}
              animating={animatingReaction === 'like'}
              active={userReactions.like}
            />
            <ReactionButton
              icon={<Heart className="w-4 h-4" />}
              count={confession.reactions?.love || 0}
              onClick={() => handleReaction('love')}
              animating={animatingReaction === 'love'}
              activeColor="text-pink-400"
              active={userReactions.love}
            />
            <ReactionButton
              icon={<Laugh className="w-4 h-4" />}
              count={confession.reactions?.laugh || 0}
              onClick={() => handleReaction('laugh')}
              animating={animatingReaction === 'laugh'}
              activeColor="text-amber-400"
              active={userReactions.laugh}
            />
          </div>

          {/* Reply + Edit + Delete */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-dark-muted hover:text-dark-text transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 text-dark-muted hover:text-accent transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 text-dark-muted hover:text-red-400 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reply thread */}
        {showReplies && <ReplyThread confessionId={confession._id} />}
      </motion.div>

      {/* Edit modal */}
      <SecretCodeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onConfirm={(secretCode, newText) =>
          onUpdate(confession._id, secretCode, newText)
        }
        title="Edit Confession"
        showTextInput
        currentText={confession.text}
      />

      {/* Delete modal */}
      <SecretCodeModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={(secretCode) => onDelete(confession._id, secretCode)}
        title="Delete Confession"
        confirmLabel="Delete"
        danger
      />
    </>
  );
};

const ReactionButton = ({ icon, count, onClick, animating, activeColor = 'text-blue-400', active = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 transition-colors cursor-pointer ${
      animating ? 'animate-pulse-reaction' : ''
    } ${
      active ? `${activeColor} opacity-100` : 'text-dark-muted hover:text-dark-text'
    }`}
  >
    {icon}
    <span className="text-xs">{count}</span>
  </button>
);

export default ConfessionCard;
