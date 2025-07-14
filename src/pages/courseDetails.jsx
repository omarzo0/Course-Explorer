import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../api/course-list";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ArrowLeftIcon from "../ui/ArrowLeftIcon";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(err.message || "Failed to load course details");
        setLoading(false);
        toast.error("Failed to load course details");
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <Loader fullPage />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center text-blue-500 hover:text-blue-600"
      >
       <ArrowLeftIcon className="h-5 w-5 mr-1" />
       
        Back to Courses
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={course.image_source}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            </div>
            <p className="text-gray-600 mb-4">By {course.teacher}</p>

            <div className="flex items-center mb-6">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                {course.category}
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About This Course</h2>
              <p className="text-gray-700">{course.description}</p>
            </div>           
          </div>
        </div>

        <div className="p-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Course Syllabus</h2>
          {course.syllabus.length > 0 ? (
            <div className="space-y-4">
              {course.syllabus.map((lesson, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{lesson.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Duration: {lesson.duration || "Not specified"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No syllabus available</p>
          )}
        </div>
      </div>
    </div>
  );
}
