import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mx-auto w-40 h-40 mb-6'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            className='text-gray-400'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>

        <h1 className='text-5xl font-bold text-gray-800 mb-4'>404</h1>

        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Page Not Found
        </h2>

        <p className='text-gray-500 mb-8'>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/'
            className='px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition'
          >
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className='px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition'
          >
            Go Back
          </button>
        </div>

        <p className='mt-8 text-sm text-gray-400'>
          Need help?{' '}
          <Link to='/contact' className='text-blue-500 hover:underline'>
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
