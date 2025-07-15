import ChevronDownIcon from '../ui/ChevronDownIcon';

export default function FilterDropdown({ value, onChange, categories }) {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === 'All' ? '' : e.target.value)}
        className='appearance-none rounded-lg border bg-white px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none'
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className='pointer-events-none absolute top-3 right-3'>
        <ChevronDownIcon className='h-4 w-4 text-gray-400' />
      </div>
    </div>
  );
}
