import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Bookmarks() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("courseBookmarks");
    const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    const courses = bookmarks.map(id => ({
      id,
      title: `Course ${id}`,
      teacher: "Teacher Name",
      description: "Bookmarked course description",
      category: "Bookmarked",
      image_source: "https://via.placeholder.com/300x200",
      lessons: [],
    }));

    setBookmarkedCourses(courses);
    setLoading(false);
  }, []);

  const toggleBookmark = (courseId, e) => {
    e.stopPropagation();
    setBookmarkLoading(courseId);
    
    setBookmarkedCourses(prev => {
      const newBookmarks = prev.filter(course => course.id !== courseId);
      
      const bookmarkIds = newBookmarks.map(course => course.id);
      localStorage.setItem("courseBookmarks", JSON.stringify(bookmarkIds));

      toast.success("Course removed from bookmarks", {
        position: "bottom-center",
        duration: 2000,
      });

      setBookmarkLoading(null);
      return newBookmarks;
    });
  };


  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Bookmarked Courses</h1>
  <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center text-blue-500 hover:text-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Courses
      </button>
      {bookmarkedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No bookmarked courses
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            You haven't bookmarked any courses yet. Start exploring courses and
            bookmark your favorites!
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isBookmarked={true}
              onBookmarkToggle={toggleBookmark}
              onClick={() => handleCourseClick(course.id)}
              isLoading={bookmarkLoading === course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}