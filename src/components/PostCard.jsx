// src/components/PostCard.jsx
//
// A single blog post preview card. Handles its own scroll-reveal
// animation and hover effects; owner-only edit/delete controls are
// rendered conditionally based on the current user.

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const PostCard = ({ post, isOwner, onEdit, onDelete }) => {
  const createdDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-card"
    >
      <Link to={`/post/${post.id}`} className="flex flex-1 flex-col">
        {/* Cover image with subtle zoom-on-hover */}
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=60'}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="mb-2 w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {post.category || 'General'}
          </span>
          <h3 className="mb-2 font-display text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-brand-700">
            {post.title}
          </h3>
          <p className="mb-4 flex-1 text-sm text-slate-500 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
            <span>{post.authorName || 'Anonymous'}</span>
            <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
          </div>
        </div>
      </Link>

      {/* Owner-only controls, absolutely positioned over the card */}
      {isOwner && (
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onEdit(post);
            }}
            className="rounded-full bg-white/90 p-2 text-slate-600 shadow-md hover:text-brand-600"
            aria-label="Edit post"
          >
            <HiOutlinePencil size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onDelete(post.id);
            }}
            className="rounded-full bg-white/90 p-2 text-slate-600 shadow-md hover:text-red-500"
            aria-label="Delete post"
          >
            <HiOutlineTrash size={16} />
          </motion.button>
        </div>
      )}
    </motion.article>
  );
};

export default PostCard;
