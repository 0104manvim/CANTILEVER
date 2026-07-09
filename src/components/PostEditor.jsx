// src/components/PostEditor.jsx
//
// Animated modal used for BOTH creating a new post and editing an
// existing one. `existingPost` being null/undefined means "create mode".

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Sports', 'Wellness', 'Books & Culture', 'Lifestyle', 'Technology', 'General'];

const emptyForm = { title: '', category: 'General', coverImage: '', excerpt: '', content: '' };

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const PostEditor = ({ isOpen, onClose, onSave, existingPost }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(existingPost);

  // Populate the form whenever a different post is being edited, or
  // reset it when switching to "create" mode.
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title || '',
        category: existingPost.category || 'General',
        coverImage: existingPost.coverImage || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [existingPost, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setSaving(true);
    // Auto-generate an excerpt from content if the author left it blank.
    const payload = {
      ...formData,
      excerpt: formData.excerpt.trim() || `${formData.content.slice(0, 140).trim()}…`,
    };
    const success = await onSave(payload, existingPost?.id);
    setSaving(false);
    if (success) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-800">
                {isEditMode ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close editor"
              >
                <HiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Post title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="url"
                  name="coverImage"
                  placeholder="Cover image URL (optional)"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <textarea
                name="excerpt"
                placeholder="Short excerpt/summary (optional — auto-generated if left blank)"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="input-field resize-none"
              />

              <textarea
                name="content"
                placeholder="Write your post..."
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="input-field resize-none"
              />

              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Publish Post'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostEditor;
