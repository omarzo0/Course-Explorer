import axios from 'axios';

const API_BASE_URL = 'https://6873c662c75558e273553885.mockapi.io/api/vi';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const CACHE_PREFIX = 'course_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const normalize = (str) => (str || '').toLowerCase().trim();

const getCacheKey = (page, limit, search, category) => {
  return `${CACHE_PREFIX}${page}_${limit}_${normalize(search)}_${normalize(category)}`;
};

const isCacheValid = (cachedData) => {
  return cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY;
};

const cleanOldCache = () => {
  for (let key in localStorage) {
    if (key.startsWith(CACHE_PREFIX)) {
      try {
        const cachedItem = JSON.parse(localStorage.getItem(key));
        if (!isCacheValid(cachedItem)) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
};

export const getCourses = async (
  page = 1,
  limit = 6,
  search = '',
  category = '',
  signal = null
) => {
  cleanOldCache();

  const cacheKey = getCacheKey(page, limit, search, category);
  let cachedData = null;

  try {
    cachedData = JSON.parse(localStorage.getItem(cacheKey));
  } catch {
    localStorage.removeItem(cacheKey);
  }

  if (isCacheValid(cachedData)) {
    return cachedData.data;
  }

  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;

    const config = signal ? { params, signal } : { params };
    const response = await api.get('/course-list', config);

    const dataToCache = {
      data: response.data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return cachedData?.data || [];
    }
    console.error('Error fetching courses:', error);
    return cachedData?.data || [];
  }
};

export const getCourseById = async (id) => {
  const cacheKey = `${CACHE_PREFIX}single_${id}`;
  let cachedData = null;

  try {
    cachedData = JSON.parse(localStorage.getItem(cacheKey));
  } catch {
    localStorage.removeItem(cacheKey);
  }

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
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return transformedData;
  } catch (error) {
    console.error('Error fetching course:', error);
    return cachedData?.data || null;
  }
};
