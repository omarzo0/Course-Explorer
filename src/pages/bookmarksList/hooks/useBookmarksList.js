import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useBookmarksList() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('courseBookmarks');
    const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    const courses = bookmarks.map((id) => ({
      id,
      title: `Course ${id}`,
      teacher: 'Teacher Name',
      description: 'Bookmarked course description',
      category: 'Bookmarked',
      image_source: 'https://via.placeholder.com/300x200',
      lessons: [],
    }));

    setBookmarkedCourses(courses);
    setLoading(false);
  }, []);

  const toggleBookmark = (courseId, e) => {
    e?.stopPropagation();
    setBookmarkLoading(courseId);

    setBookmarkedCourses((prev) => {
      const newBookmarks = prev.filter((course) => course.id !== courseId);
      const bookmarkIds = newBookmarks.map((course) => course.id);
      
      localStorage.setItem('courseBookmarks', JSON.stringify(bookmarkIds));
      toast.success('Course removed from bookmarks', {
        position: 'bottom-center',
        duration: 2000,
      });

      setBookmarkLoading(null);
      return newBookmarks;
    });
  };

  return {
    bookmarkedCourses,
    loading,
    bookmarkLoading,
    toggleBookmark
  };
}