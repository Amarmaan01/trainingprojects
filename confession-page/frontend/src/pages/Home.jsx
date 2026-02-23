import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SortBar from '../components/SortBar';
import ConfessionForm from '../components/ConfessionForm';
import ConfessionCard from '../components/ConfessionCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import {
  fetchConfessions,
  createConfession,
  updateConfession,
  deleteConfession,
} from '../services/api';

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [confessionCount, setConfessionCount] = useState(0);
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { addToast } = useToast();

  const loadConfessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchConfessions(sort);
      setConfessions(data.data);
      setConfessionCount(data.count);
    } catch {
      addToast('Failed to load confessions', 'error');
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    loadConfessions();
  }, [loadConfessions]);

  const handleCreate = async (formData) => {
    try {
      await createConfession(formData);
      addToast('Confession posted anonymously! 🎭');
      loadConfessions();
    } catch (err) {
      addToast(
        err?.response?.data?.message || 'Failed to post confession',
        'error'
      );
      throw err;
    }
  };

  const handleUpdate = async (id, secretCode, newText) => {
    try {
      await updateConfession(id, { secretCode, text: newText });
      addToast('Confession updated! ✏️');
      loadConfessions();
    } catch (err) {
      addToast(
        err?.response?.data?.message || 'Failed to update confession',
        'error'
      );
      throw err;
    }
  };

  const handleDelete = async (id, secretCode) => {
    try {
      await deleteConfession(id, secretCode);
      addToast('Confession deleted 🗑️');
      loadConfessions();
    } catch (err) {
      addToast(
        err?.response?.data?.message || 'Failed to delete confession',
        'error'
      );
      throw err;
    }
  };

  const handleReactionUpdate = (id, newReactions) => {
    setConfessions((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, reactions: newReactions } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pb-12">
        <Hero
          onConfessClick={() => setShowForm(true)}
          confessionCount={confessionCount}
        />

        <SortBar activeSort={sort} onSortChange={setSort} />

        {loading ? (
          <SkeletonLoader />
        ) : confessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-muted text-lg mb-2">
              No confessions yet...
            </p>
            <p className="text-dark-muted/60 text-sm">
              Be the first to share your truth
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {confessions.map((confession) => (
              <ConfessionCard
                key={confession._id}
                confession={confession}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onReactionUpdate={handleReactionUpdate}
              />
            ))}
          </AnimatePresence>
        )}
      </main>

      <ConfessionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Home;
