import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import BookmarkFilled from '../ui/BookmarkFilled';
import BookmarkOutline from '../ui/BookmarkOutline';
import UserIcon from '../ui/UserIcon';
export default function CourseCard({ course, isBookmarked, onBookmarkToggle, isLoading }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (!isLoading) {
      onBookmarkToggle(course.id, e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className='relative flex h-[450px] cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl'
      onClick={handleCardClick}
    >
      {isLoading && (
        <div className='bg-opacity-20 absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
        </div>
      )}

      <div className='relative h-48 w-full overflow-hidden'>
        <img
          src={course.image_source}
          className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
      </div>
      <div className='flex flex-grow flex-col justify-between'>
        <div className='p-5'>
          <div className='mb-3 flex items-start justify-between'>
            <h3 className='line-clamp-2 min-h-[3rem] text-lg font-bold text-gray-800'>
              {course.title}
            </h3>
            <motion.button
              onClick={handleBookmarkClick}
              disabled={isLoading}
              className={`ml-2 focus:outline-none ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isBookmarked ? <BookmarkFilled /> : <BookmarkOutline />}
            </motion.button>
          </div>

          <p className='mb-2 flex items-center text-sm text-gray-600'>
            <UserIcon />
            {course.teacher}
          </p>

          <p className='mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-gray-700'>
            {course.description}
          </p>

          <div className='mt-auto flex items-center justify-between'>
            <span className='inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
              {course.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
