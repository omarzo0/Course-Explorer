import ClearSearchIcon from '../../../ui/ClearSearchIcon';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className='relative flex-1'>
      <input
        type='text'
        placeholder='Search courses by title or teacher...'
        className='w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none'
        value={value}
        onChange={onChange}
      />
      {value && (
        <button
          onClick={onClear}
          className='absolute top-2.5 right-3 text-gray-400 hover:text-gray-600'
          aria-label='Clear search'
        >
          <ClearSearchIcon className='h-5 w-5' />
        </button>
      )}
    </div>
  );
}
