// src/pages/PostPage.jsx
//
// Full post detail view, reached via /post/:id. Fetches the single
// document directly (rather than reusing the full posts subscription)
// to keep this page lightweight and shareable via a direct link.

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { format } from 'date-fns';
import { db } from '../firebase/config';
import Loader from '../components/Loader';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const snap = await getDoc(doc(db, 'posts', id));
        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Loader />;

  if (notFound || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-800">Post not found</h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const createdDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto max-w-3xl px-6 py-12"
    >
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <HiOutlineArrowLeft /> Back to all posts
      </Link>

      <span className="mb-3 inline-block w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
        {post.category || 'General'}
      </span>

      <h1 className="mb-3 font-display text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 flex items-center gap-3 text-sm text-slate-400">
        <span>{post.authorName || 'Anonymous'}</span>
        <span>•</span>
        <span>{format(createdDate, 'MMMM d, yyyy')}</span>
      </div>

      {post.coverImage && (
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={post.coverImage}
          alt={post.title}
          className="mb-8 h-72 w-full rounded-2xl object-cover shadow-card sm:h-96"
        />
      )}

      <div className="prose prose-slate max-w-none whitespace-pre-line text-base leading-relaxed text-slate-700">
        {post.content}
      </div>
    </motion.article>
  );
};

export default PostPage;
