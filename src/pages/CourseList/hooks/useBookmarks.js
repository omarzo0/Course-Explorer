// hooks/useBookmarks.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('courseBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const toggleBookmark = (courseId, e) => {
    e?.stopPropagation();
    setBookmarkLoading(courseId);
    setBookmarks((prev) => {
      const newBookmarks = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];

      localStorage.setItem('courseBookmarks', JSON.stringify(newBookmarks));

      toast.success(
        prev.includes(courseId) ? 'Course removed from bookmarks' : 'Course added to bookmarks',
        {
          position: 'bottom-center',
          duration: 2000,
        }
      );

      setBookmarkLoading(null);
      return newBookmarks;
    });
  };

  return {
    bookmarks,
    bookmarkLoading,
    toggleBookmark,
  };
}