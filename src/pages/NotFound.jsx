import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md text-center'>
        <div className='mx-auto mb-6 h-40 w-40'>
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

        <h1 className='mb-4 text-5xl font-bold text-gray-800'>404</h1>

        <h2 className='mb-4 text-2xl font-semibold text-gray-700'>Page Not Found</h2>

        <p className='mb-8 text-gray-500'>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Link
            to='/'
            className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700'
          >
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className='rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100'
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
