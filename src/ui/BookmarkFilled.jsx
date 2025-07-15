export default function BookmarkFilled({ className = 'h-6 w-6 text-yellow-500' }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path d='M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z' />
    </svg>
  );
}
