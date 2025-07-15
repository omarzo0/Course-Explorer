import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import CourseCard from '../components/CourseCard';
import ArrowLeftIcon from '../ui/ArrowLeftIcon';
import BookmarkOutlineIcon from '../ui/BookmarkOutlineIcon';

export default function Bookmarks() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const navigate = useNavigate();

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
    e.stopPropagation();
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

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-8'>
        <div className='h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Bookmarked Courses</h1>
      <button
        onClick={() => navigate('/')}
        className='mb-6 flex items-center text-blue-500 hover:text-blue-600'
      >
        <ArrowLeftIcon className='mr-1 h-5 w-5' />
        Back to Courses
      </button>
      {bookmarkedCourses.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <BookmarkOutlineIcon className='mb-4 h-16 w-16 text-gray-400' />

          <h2 className='mb-2 text-xl font-medium text-gray-600'>No bookmarked courses</h2>
          <p className='mb-6 max-w-md text-gray-500'>
            You haven't bookmarked any courses yet. Start exploring courses and bookmark your
            favorites!
          </p>
          <button
            onClick={() => navigate('/')}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {bookmarkedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isBookmarked={true}
              onBookmarkToggle={toggleBookmark}
              onClick={() => handleCourseClick(course.id)}
              isLoading={bookmarkLoading === course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
