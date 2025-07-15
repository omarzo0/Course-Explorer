
export default function SyllabusList({ syllabus }) {
  return (
    <div className='border-t p-8'>
      <h2 className='mb-4 text-2xl font-semibold'>Course Syllabus</h2>
      {syllabus.length > 0 ? (
        <div className='space-y-4'>
          {syllabus.map((lesson, index) => (
            <div key={index} className='rounded-lg border p-4'>
              <h3 className='text-lg font-medium'>
                Lesson {index + 1}: {lesson.title}
              </h3>
              <p className='mt-1 text-gray-600'>{lesson.description}</p>
              <p className='mt-2 text-sm text-gray-500'>
                Duration: {lesson.duration || 'Not specified'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500'>No syllabus available</p>
      )}
    </div>
  );
}