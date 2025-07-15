import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getCourseById } from '../../../api/course-list';

export function useCourseDetails(id) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError(err.message || 'Failed to load course details');
        setLoading(false);
        toast.error('Failed to load course details');
      }
    };

    fetchCourse();
  }, [id]);

  return {
    course,
    loading,
    error,
  };
}