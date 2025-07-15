export default function CourseDescription({ description }) {
  return (
    <div className='mb-6'>
      <h2 className='mb-2 text-xl font-semibold'>About This Course</h2>
      <p className='text-gray-700'>{description}</p>
    </div>
  );
}