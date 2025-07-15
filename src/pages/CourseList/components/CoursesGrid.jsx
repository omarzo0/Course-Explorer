// components/CoursesGrid.js
import CourseCard from './CourseCard';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function CoursesGrid({
  courses,
  bookmarks,
  bookmarkLoading,
  toggleBookmark,
  handleCourseClick,
  lastCourseElementRef,
  loading,
}) {
  return (
    <div className='space-y-10'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {courses.map((course, index) => {
          if (courses.length === index + 1) {
            return (
              <div ref={lastCourseElementRef} key={course.id}>
                <CourseCard
                  course={course}
                  isBookmarked={bookmarks.includes(course.id)}
                  onBookmarkToggle={toggleBookmark}
                  onClick={() => handleCourseClick(course.id)}
                  isLoading={bookmarkLoading === course.id}
                />
              </div>
            );
          } else {
            return (
              <CourseCard
                key={course.id}
                course={course}
                isBookmarked={bookmarks.includes(course.id)}
                onBookmarkToggle={toggleBookmark}
                onClick={() => handleCourseClick(course.id)}
                isLoading={bookmarkLoading === course.id}
              />
            );
          }
        })}
      </div>

      {loading && courses.length > 0 && (
        <div className='flex justify-center py-8'>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}