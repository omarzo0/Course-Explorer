import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '../../../ui/ArrowLeftIcon';

export default function BackButton({ to = '/', children = 'Back to Courses' }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(to)}
      className='mb-6 flex items-center text-blue-500 hover:text-blue-600'
    >
      <ArrowLeftIcon className='mr-1 h-5 w-5' />
      {children}
    </button>
  );
}