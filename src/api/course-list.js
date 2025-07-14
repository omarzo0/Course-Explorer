import axios from 'axios';

const API_BASE_URL = 'https://6873c662c75558e273553885.mockapi.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getCourses = async (
  page = 1,
  limit = 6,
  search = '',
  category = '',
  signal = null
) => {
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
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return [];
    }
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/course-list/${id}`);
    return {
      id: response.data.id,
      title: response.data.Title,
      teacher: response.data['Teacher-Name'],
      description:
        response.data['Long-Description'] || response.data['Short-Description'],
      category: response.data.category,
      image_source:
        response.data.Image?.url && response.data.Image.url.trim() !== ''
          ? response.data.Image.url
          : 'https://via.placeholder.com/800x450',
      lessons: response.data.lessons || [],
      duration: response.data.duration || 'Not specified',
      level: response.data.level || 'Beginner',
      rating: response.data.rating || 0,
      students: response.data.students || 0,
      syllabus: response.data.syllabus || [],
      requirements: response.data.requirements || [],
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};
