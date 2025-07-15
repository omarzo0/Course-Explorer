export default function CourseHeader({ title, teacher, category, image }) {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
      <div className='md:flex'>
        <div className='md:w-1/2'>
          <img
            src={image}
            alt={title}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='p-8 md:w-1/2'>
          <div className='flex items-start justify-between'>
            <h1 className='mb-2 text-3xl font-bold'>{title}</h1>
          </div>
          <p className='mb-4 text-gray-600'>By {teacher}</p>

          <div className='mb-6 flex items-center'>
            <span className='mr-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'>
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}