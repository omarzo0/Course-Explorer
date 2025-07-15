// components/EmptyState.js
import SadFaceIcon from '../../../ui/SadFaceIcon';

export default function EmptyState({ 
  searchTerm, 
  categoryFilter, 
  onResetFilters 
}) {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <SadFaceIcon className='mb-4 h-16 w-16 text-gray-400' />
      <h2 className='mb-2 text-xl font-medium text-gray-600'>No courses found</h2>
      <p className='mb-6 max-w-md text-gray-500'>
        {searchTerm || categoryFilter
          ? 'No courses match your search criteria. Try adjusting your filters.'
          : 'There are currently no courses available. Please check back later.'}
      </p>
      <button
        onClick={onResetFilters}
        className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
      >
        Reset Filters
      </button>
    </div>
  );
}