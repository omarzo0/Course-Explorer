// components/FiltersBar.js
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';

export default function FiltersBar({
  searchTerm,
  handleSearch,
  categoryFilter,
  handleCategoryChange,
}) {
  return (
    <div className='mb-8 flex flex-col gap-4 md:flex-row'>
      <SearchBar
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onClear={() => handleSearch('')}
      />
      <FilterDropdown
        value={categoryFilter}
        onChange={handleCategoryChange}
        categories={[
          'All',
          'Frontend',
          'Backend',
          'Fullstack',
          'Mobile',
          'DevOps',
          'Data Science',
          'AI/ML',
        ]}
      />
      <Link
        to='/bookmarks'
        className='rounded-lg bg-blue-500 px-6 py-2 text-white no-underline transition-colors hover:bg-blue-600'
      >
        Bookmarks
      </Link>
    </div>
  );
}