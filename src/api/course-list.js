import axios from 'axios';

const API_BASE_URL = 'https://6873c662c75558e273553885.mockapi.io/api/vi';

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
    const data = response.data;

    return {
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
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

