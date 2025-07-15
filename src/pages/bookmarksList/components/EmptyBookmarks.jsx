
import { useNavigate } from 'react-router-dom';
import BookmarkOutlineIcon from '../../../ui/BookmarkOutlineIcon';

export default function EmptyBookmarks() {
  const navigate = useNavigate();

  return (
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
  );
}