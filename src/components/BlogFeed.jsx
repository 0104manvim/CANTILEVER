// src/components/BlogFeed.jsx
//
// Renders the grid of blog posts with a category filter and search box.
// Consumes the `usePosts` hook so BlogFeed itself stays purely presentational.

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

const BlogFeed = ({ posts, loading, onEdit, onDelete }) => {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const unique = new Set(posts.map((p) => p.category || 'General'));
    return ['All', ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  if (loading) return <Loader fullScreen={false} />;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-card'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search posts…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field sm:w-64"
        />
      </div>

      {/* Grid */}
      {filteredPosts.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center text-slate-400"
        >
          No posts found. {currentUser ? 'Be the first to publish one!' : 'Check back soon.'}
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={currentUser?.uid === post.authorId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogFeed;
