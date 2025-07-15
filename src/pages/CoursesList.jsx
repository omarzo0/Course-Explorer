import debounce from 'lodash.debounce';
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

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
    async (pageNum = 1, search = '', category = '', isLoadMore = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!isLoadMore) {
          setLoading(true);
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

        if (isLoadMore) {
          setCourses((prev) => [...prev, ...transformedData]);
        } else {
          setCourses(transformedData);
        }

        setHasMore(data.length >= 6);
        setPage(pageNum);
        setInitialLoad(false);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch courses:', err);
          setError(err.message || 'Failed to load courses');
          setInitialLoad(false);
          setLoading(false);
          if (!isLoadMore) {
            setCourses([]);
          }
          toast.error('Failed to load courses. Please try again.');
        }
      }
    },
    []
  );

  const debouncedSearch = useCallback(
    debounce((search, category) => {
      fetchCourses(1, search, category);
    }, 500),
    [fetchCourses]
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    debouncedSearch(term, categoryFilter);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    debouncedSearch(searchTerm, category === 'All' ? '' : category);
  };

  const handleCourseClick = useCallback(
    (courseId) => {
      navigate(`/courses/${courseId}`);
    },
    [navigate]
  );

  useEffect(() => {
    fetchCourses(1, '', '');

    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCourses, debouncedSearch]);

  if (initialLoad) {
    return (
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-8'>
        <div className='h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const showEmptyState = !loading && courses.length === 0;

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

      {loading && !initialLoad && (
        <div className='flex justify-center py-8'>
          <div className='h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
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
              fetchCourses(1, '', '');
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
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isBookmarked={bookmarks.includes(course.id)}
                  onBookmarkToggle={toggleBookmark}
                  onClick={() => handleCourseClick(course.id)}
                  isLoading={bookmarkLoading === course.id}
                />
              ))}
            </div>

            {hasMore && !loading && courses.length > 0 && (
              <div className='flex justify-center'>
                <button
                  onClick={() => fetchCourses(page + 1, searchTerm, categoryFilter, true)}
                  className='rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600'
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
