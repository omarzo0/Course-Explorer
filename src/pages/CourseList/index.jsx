// pages/CoursesList.js
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from './hooks/useCourses';
import { useBookmarks } from './hooks/useBookmarks';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import CoursesGrid from './components/CoursesGrid';
import FiltersBar from './components/FiltersBar';

export default function CoursesList() {
  const {
    courses,
    loading,
    error,
    page,
    hasMore,
    searchTerm,
    categoryFilter,
    handleSearch,
    handleCategoryChange,
    fetchCourses,
  } = useCourses();

  const { bookmarks, bookmarkLoading, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const observerRef = useRef();

  const handleCourseClick = useCallback(
    (courseId) => {
      navigate(`/courses/${courseId}`);
    },
    [navigate]
  );

  const lastCourseElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchCourses(page + 1, searchTerm, categoryFilter, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, page, searchTerm, categoryFilter, fetchCourses, loading]
  );

  const handleResetFilters = () => {
    handleSearch('');
    handleCategoryChange('');
  };

  if (loading && page === 1 && courses.length === 0) {
    return (
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-8'>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const showEmptyState = !loading && courses.length === 0 && !error;

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>All Courses</h1>

      <FiltersBar
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        categoryFilter={categoryFilter}
        handleCategoryChange={handleCategoryChange}
      />

      {error && (
        <div className='py-8 text-center text-red-500'>
          <p>{error}</p>
        </div>
      )}

      {showEmptyState ? (
        <EmptyState
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <CoursesGrid
          courses={courses}
          bookmarks={bookmarks}
          bookmarkLoading={bookmarkLoading}
          toggleBookmark={toggleBookmark}
          handleCourseClick={handleCourseClick}
          lastCourseElementRef={lastCourseElementRef}
          loading={loading}
        />
      )}
    </div>
  );
}