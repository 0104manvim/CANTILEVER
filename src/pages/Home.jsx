// src/pages/Home.jsx
//
// Landing page: animated hero section + the public blog feed.
// Edit/delete handlers are passed down so post owners can manage
// their own posts directly from the main feed too.

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import BlogFeed from '../components/BlogFeed';
import PostEditor from '../components/PostEditor';
import { usePosts } from '../hooks/usePosts';

const Home = () => {
  const { posts, loading, editPost, removePost } = usePosts();
  const [editingPost, setEditingPost] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  const handleSave = async (data, postId) => editPost(postId, data);

  const handleDelete = async (postId) => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      await removePost(postId);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl"
        >
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Stories worth reading
          </span>
          <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl">
            Welcome to <span className="text-gradient">Inkwell</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            A modern space to read, write, and share ideas — from sports and wellness to books
            and everything in between.
          </p>
        </motion.div>

        {/* Decorative blurred blobs for visual depth */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </section>

      <BlogFeed posts={posts} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <PostEditor
        isOpen={editorOpen}
        existingPost={editingPost}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Home;
