import axios from 'axios';

const API_BASE_URL = 'https://6873c662c75558e273553885.mockapi.io/api/vi';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const CACHE_PREFIX = 'course_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; 

const getCacheKey = (page, limit, search, category) => {
  return `${CACHE_PREFIX}${page}_${limit}_${search}_${category}`;
};

const isCacheValid = (cachedData) => {
  return cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRY;
};

export const getCourses = async (
  page = 1,
  limit = 6,
  search = '',
  category = '',
  signal = null
) => {
  const cacheKey = getCacheKey(page, limit, search, category);
  
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));
  if (isCacheValid(cachedData)) {
    return cachedData.data;
  }

  try {
    const params = {
      page,
      limit,
    };

    if (search) {
      params.search = search;
    }

    if (category && category !== 'All') {
      params.category = category;
    }

    const config = signal ? { params, signal } : { params };
    const response = await api.get('/course-list', config);
    
    const dataToCache = {
      data: response.data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      if (cachedData) return cachedData.data;
      return [];
    }
    console.error('Error fetching courses:', error);
    if (cachedData) return cachedData.data;
    throw error;
  }
};

export const getCourseById = async (id) => {
  const cacheKey = `${CACHE_PREFIX}single_${id}`;
  
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));
  if (isCacheValid(cachedData)) {
    return cachedData.data;
  }

  try {
    const response = await api.get(`/course-list/${id}`);
    const data = response.data;

    const transformedData = {
      id: data.id,
      title: data.Title,
      teacher: data['Teacher-Name'],
      description: data['Full-Description'] || data['Short-Description'],
      category: data.category,
      image_source:
        data.Image?.url && data.Image.url.trim() !== ''
          ? data.Image.url
          : 'https://via.placeholder.com/800x450',
      level: data.level || 'Beginner',
      duration: data.duration || 'Not specified',
      rating: data.rating || 0,
      students: data.students || 0,
      requirements: data.requirements || [],
      syllabus:
        data.listOfLessons?.map((lesson) => ({
          title: lesson.title,
          description: lesson.description || '',
          duration: lesson.duration || 'Not specified',
        })) || [],
    };

    const dataToCache = {
      data: transformedData,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return transformedData;
  } catch (error) {
    console.error('Error fetching course:', error);

    if (cachedData) return cachedData.data;
    throw error;
  }
};