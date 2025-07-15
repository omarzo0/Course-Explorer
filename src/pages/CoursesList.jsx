import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../api/course-list';
import CourseCard from '../components/CourseCard';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import SadFaceIcon from '../ui/SadFaceIcon';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  const observerRef = useRef();
  const loadingRef = useRef(false);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('courseBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const toggleBookmark = useCallback((courseId, e) => {
    e.stopPropagation();
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
  }, []);

  const fetchCourses = useCallback(
    async (pageNum, search, category, isLoadMore = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); 
      }
 
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true); 

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!isLoadMore) {
          setCourses([]);
          setError(null);
        }

        const data = await getCourses(pageNum, 6, search, category, controller.signal);

        const transformedData = data.map((item) => ({
          id: item.id,
          title: item.Title,
          teacher: item['Teacher-Name'],
          description: item['Short-Description'],
          category: item.category,
          image_source:
            item.Image?.url && item.Image.url.trim() !== ''
              ? item.Image.url
              : 'https://via.placeholder.com/300x200',
          lessons: [],
        }));

        setCourses((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
        setHasMore(data.length >= 6); 
        setPage(pageNum);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch courses:', err);
          setError(err.message || 'Failed to load courses');
          toast.error('Failed to load courses. Please try again.');
        }
      } finally {
        setLoading(false);
        loadingRef.current = false; 
      }
    },
    []
  );

  useEffect(() => {
    const debouncedFetch = setTimeout(() => {
      fetchCourses(1, searchTerm, categoryFilter, false); 
    }, 500); 
    return () => {
      clearTimeout(debouncedFetch);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm, categoryFilter, fetchCourses]); 

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    const value = category === 'All' ? '' : category;
    setCategoryFilter(value);
  };

  const handleCourseClick = useCallback(
    (courseId) => {
      navigate(`/courses/${courseId}`);
    },
    [navigate]
  );

  const lastCourseElementRef = useCallback(
    (node) => {
      if (loadingRef.current || !hasMore) return; 
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchCourses(page + 1, searchTerm, categoryFilter, true); 
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, page, searchTerm, categoryFilter, fetchCourses]
  );

  if (loading && page === 1 && courses.length === 0) {
    return (
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-8'>
        <div className='h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const showEmptyState = !loading && courses.length === 0 && !error;

  return (
    <div className='container mx-auto min-h-screen px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>All Courses</h1>

      <div className='mb-8 flex flex-col gap-4 md:flex-row'>
        <SearchBar
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch('')}
        />
        <FilterDropdown
          value={categoryFilter}
          onChange={handleCategoryChange}
          categories={[
            'All',
            'Frontend',
            'Backend',
            'Fullstack',
            'Mobile',
            'DevOps',
            'Data Science',
            'AI/ML',
          ]}
        />
        <Link
          to='/bookmarks'
          className='rounded-lg bg-blue-500 px-6 py-2 text-white no-underline transition-colors hover:bg-blue-600'
        >
          Bookmarks
        </Link>
      </div>

      {error && (
        <div className='py-8 text-center text-red-500'>
          <p>{error}</p>
        </div>
      )}

      {showEmptyState ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <SadFaceIcon className='mb-4 h-16 w-16 text-gray-400' />

          <h2 className='mb-2 text-xl font-medium text-gray-600'>No courses found</h2>
          <p className='mb-6 max-w-md text-gray-500'>
            {searchTerm || categoryFilter
              ? 'No courses match your search criteria. Try adjusting your filters.'
              : 'There are currently no courses available. Please check back later.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
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
                <div className='h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}