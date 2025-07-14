import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BookmarkFilled from "../ui/BookmarkFilled";
import BookmarkOutline from "../ui/BookmarkOutline";
import UserIcon  from "../ui/UserIcon";
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
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative border border-gray-100 h-[450px] flex flex-col" 
  onClick={handleCardClick}
>

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={course.image_source}

          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
<div className=" flex flex-col justify-between flex-grow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3rem]">
            {course.title}
          </h3>
          <motion.button
            onClick={handleBookmarkClick}
            disabled={isLoading}
            className={`ml-2 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
           {isBookmarked ? (
  <BookmarkFilled />
) : (
  <BookmarkOutline />
)}
          </motion.button>
        </div>

        <p className="text-sm text-gray-600 mb-2 flex items-center">
        <UserIcon />
          {course.teacher}
        </p>

    <p className="text-gray-700 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {course.description}
        </p>

         <div className="flex justify-between items-center mt-auto">
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
      {course.category}
    </span>
  </div>
      </div>
      </div>
    </motion.div>
  );
}