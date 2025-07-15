import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { getCourseById } from '../api/course-list';
import Loader from '../components/Loader';
import ArrowLeftIcon from '../ui/ArrowLeftIcon';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return <Loader fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <button
        onClick={() => navigate('/')}
        className='mb-6 flex items-center text-blue-500 hover:text-blue-600'
      >
        <ArrowLeftIcon className='mr-1 h-5 w-5' />
        Back to Courses
      </button>

      <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='md:flex'>
          <div className='md:w-1/2'>
            <img
              src={course.image_source}
              alt={course.title}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='p-8 md:w-1/2'>
            <div className='flex items-start justify-between'>
              <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
            </div>
            <p className='mb-4 text-gray-600'>By {course.teacher}</p>

            <div className='mb-6 flex items-center'>
              <span className='mr-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'>
                {course.category}
              </span>
            </div>
            <div className='mb-6'>
              <h2 className='mb-2 text-xl font-semibold'>About This Course</h2>
              <p className='text-gray-700'>{course.description}</p>
            </div>
          </div>
        </div>

        <div className='border-t p-8'>
          <h2 className='mb-4 text-2xl font-semibold'>Course Syllabus</h2>
          {course.syllabus.length > 0 ? (
            <div className='space-y-4'>
              {course.syllabus.map((lesson, index) => (
                <div key={index} className='rounded-lg border p-4'>
                  <h3 className='text-lg font-medium'>
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <p className='mt-1 text-gray-600'>{lesson.description}</p>
                  <p className='mt-2 text-sm text-gray-500'>
                    Duration: {lesson.duration || 'Not specified'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No syllabus available</p>
          )}
        </div>
      </div>
    </div>
  );
}
