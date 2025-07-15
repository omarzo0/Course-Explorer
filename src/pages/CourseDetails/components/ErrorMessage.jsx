export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8'>
      <div className='mb-4 text-red-500'>{message}</div>
      <button
        onClick={onRetry}
        className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
      >
        Try Again
      </button>
    </div>
  );
}