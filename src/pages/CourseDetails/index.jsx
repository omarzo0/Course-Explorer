import { useParams } from 'react-router-dom';
import { useCourseDetails } from './hooks/useCourseDetails';
import Loader from '../../components/Loader';
import ErrorMessage from './components/ErrorMessage';
import BackButton from './components/BackButton';
import CourseHeader from './components/CourseHeader';
import CourseDescription from './components/CourseDescription';
import SyllabusList from './components/SyllabusList';

export default function CourseDetails() {
  const { id } = useParams();
  const { course, loading, error } = useCourseDetails(id);

  if (loading) {
    return <Loader fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!course) {
    return null; 
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <BackButton />

      <CourseHeader
        title={course.title}
        teacher={course.teacher}
        category={course.category}
        image={course.image_source}
      />

      <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='p-8'>
          <CourseDescription description={course.description} />
        </div>
        
        <SyllabusList syllabus={course.syllabus || []} />
      </div>
    </div>
  );
}