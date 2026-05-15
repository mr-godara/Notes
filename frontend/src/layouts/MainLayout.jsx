import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const MainLayout = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
    <Navbar searchTerm={searchTerm} onSearchChange={onSearchChange} onClearSearch={onClearSearch} />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
