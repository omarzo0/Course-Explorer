import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CoursesList from '../pages/CoursesList';
import CourseDetail from '../pages/CourseDetail';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CoursesList />} />
        <Route path='/courses/:id' element={<CourseDetail />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}
