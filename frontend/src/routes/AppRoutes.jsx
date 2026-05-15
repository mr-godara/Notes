import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import About from '../pages/About.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

const AppRoutes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const focusSearch = (event) => {
      if (event.key === '/' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.querySelector('input[aria-label="Search notes"]')?.focus();
      }
    };

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={(
            <MainLayout
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearSearch={() => setSearchTerm('')}
            />
          )}
        >
          <Route index element={<Dashboard searchTerm={searchTerm} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
