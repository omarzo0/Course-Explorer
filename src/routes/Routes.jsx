import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Bookmarks from '../pages/Bookmarks';
import CourseDetail from '../pages/CourseDetails/index';
import CoursesList from '../pages/CourseList/index';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CoursesList />} />
        <Route path='/courses/:id' element={<CourseDetail />} />
        <Route path='/bookmarks' element={<Bookmarks />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}
