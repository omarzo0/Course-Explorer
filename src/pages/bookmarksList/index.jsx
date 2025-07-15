
import { useNavigate } from 'react-router-dom';
import { useBookmarksList } from './hooks/useBookmarksList';
import CourseCard from '../../components/CourseCard';
import BackButton from '../../components/BackButton';
import EmptyBookmarks from './components/EmptyBookmarks';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Bookmarks() {
  const navigate = useNavigate();
  const {
    bookmarkedCourses,
    loading,
    bookmarkLoading,
    toggleBookmark
  } = useBookmarksList();

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-8'>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Bookmarked Courses</h1>
      <BackButton />
      
      {bookmarkedCourses.length === 0 ? (
        <EmptyBookmarks />
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