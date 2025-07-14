import { useNavigate } from "react-router-dom";

export default function CourseCard({
  course,
  isBookmarked,
  onBookmarkToggle,
  isLoading,
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (!isLoading) {
      onBookmarkToggle(course.id, e);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
      onClick={handleCardClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <img
        src={course.image_source}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <button
            onClick={handleBookmarkClick}
            disabled={isLoading}
            className={`text-gray-400 hover:text-yellow-500 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-2">By {course.teacher}</p>
        <p className="text-gray-700 mb-3">{course.description}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {course.category}
        </span>
      </div>
    </div>
  );
}