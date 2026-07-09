// src/hooks/usePosts.js
//
// Encapsulates all Firestore reads/writes for blog posts in one place.
// Components never talk to Firestore directly — they call the functions
// returned here, which keeps CRUD logic modular and easy to test/reuse.

import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';

const POSTS_COLLECTION = 'posts';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener: any create/update/delete anywhere (this tab,
    // another tab, another user) instantly reflects in the UI.
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setPosts(fetched);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        toast.error('Could not load posts. Please try again.');
        setLoading(false);
      }
    );

    return unsubscribe; // detach the listener when the hook unmounts
  }, []);

  // CREATE
  const addPost = useCallback(async (postData, user) => {
    try {
      await addDoc(collection(db, POSTS_COLLECTION), {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Post published!');
      return true;
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('Failed to publish post.');
      return false;
    }
  }, []);

  // UPDATE
  const editPost = useCallback(async (postId, updatedData) => {
    try {
      const postRef = doc(db, POSTS_COLLECTION, postId);
      await updateDoc(postRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      toast.success('Post updated!');
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post.');
      return false;
    }
  }, []);

  // DELETE
  const removePost = useCallback(async (postId) => {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, postId));
      toast.success('Post deleted.');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post.');
      return false;
    }
  }, []);

  return { posts, loading, addPost, editPost, removePost };
};
