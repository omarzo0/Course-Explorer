import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import { getCourses } from "../api/course-list";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const abortControllerRef = useRef(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const navigate = useNavigate();

  // Load saved bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("courseBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Bookmark toggle function
  const toggleBookmark = useCallback((courseId, e) => {
    e.stopPropagation();
    setBookmarkLoading(courseId);
    setBookmarks((prev) => {
      const newBookmarks = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];

      localStorage.setItem("courseBookmarks", JSON.stringify(newBookmarks));

      toast.success(
        prev.includes(courseId)
          ? "Course removed from bookmarks"
          : "Course added to bookmarks",
        {
          position: "bottom-center",
          duration: 2000,
        }
      );

      setBookmarkLoading(null);
      return newBookmarks;
    });
  }, []);

  // Fetch courses with pagination and filtering
  const fetchCourses = useCallback(
    async (pageNum = 1, search = "", category = "", isLoadMore = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!isLoadMore) {
          setLoading(true);
          setError(null);
        }

        const data = await getCourses(
          pageNum,
          6,
          search,
          category,
          controller.signal
        );

        const transformedData = data.map((item) => ({
          id: item.id,
          title: item.Title,
          teacher: item["Teacher-Name"],
          description: item["Short-Description"],
          category: item.category,
          image_source:
            item.Image?.url && item.Image.url.trim() !== ""
              ? item.Image.url
              : "https://via.placeholder.com/300x200",
          lessons: [],
        }));

        if (isLoadMore) {
          setCourses((prev) => [...prev, ...transformedData]);
        } else {
          setCourses(transformedData);
        }

        setHasMore(data.length >= 6);
        setPage(pageNum);
        setInitialLoad(false);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch courses:", err);
          setError(err.message || "Failed to load courses");
          setInitialLoad(false);
          setLoading(false);
          toast.error("Failed to load courses. Please try again.");
        }
      }
    },
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search, category) => {
      setPage(1);
      fetchCourses(1, search, category);
    }, 500),
    [fetchCourses]
  );

  // Search handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "" && categoryFilter === "") {
      // If both search and filter are empty, do immediate fetch
      fetchCourses(1, "", "");
    } else {
      debouncedSearch(term, categoryFilter);
    }
  };

  // Category filter handler
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    if (category === "" && searchTerm === "") {
      // If both search and filter are empty, do immediate fetch
      fetchCourses(1, "", "");
    } else {
      debouncedSearch(searchTerm, category);
    }
  };

  // Handle course card click
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // Initial load and cleanup
  useEffect(() => {
    fetchCourses(1, "", "");

    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCourses, debouncedSearch]);

  // Render loading, error, or empty states
  if (initialLoad) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const showEmptyState = !loading && courses.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
        />
        <FilterDropdown
          value={categoryFilter}
          onChange={handleCategoryChange}
          categories={[
            "All",
            "Frontend",
            "Backend",
            "Fullstack",
            "Mobile",
            "DevOps",
            "Data Science",
            "AI/ML",
          ]}
        />
      </div>

      {loading && !initialLoad && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showEmptyState ? (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No courses found
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchTerm || categoryFilter !== "All"
              ? "No courses match your search criteria. Try adjusting your filters."
              : "There are currently no courses available. Please check back later."}
          </p>
          <button
            onClick={() => {
              handleSearch("");
              handleCategoryChange("All");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isBookmarked={bookmarks.includes(course.id)}
                onBookmarkToggle={toggleBookmark}
                onClick={() => handleCourseClick(course.id)}
                isLoading={bookmarkLoading === course.id}
              />
            ))}
          </div>

          {hasMore && !loading && courses.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  fetchCourses(page + 1, searchTerm, categoryFilter, true)
                }
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
