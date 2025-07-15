// hooks/useCourses.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCourses } from '../../../api/course-list';
import toast from 'react-hot-toast';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const abortControllerRef = useRef(null);
  const loadingRef = useRef(false);

  const fetchCourses = useCallback(async (pageNum, search, category, isLoadMore = false) => {
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
  }, []);

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

  return {
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
  };
}