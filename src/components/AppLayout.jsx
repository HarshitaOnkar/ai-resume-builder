import { Link, Outlet, useLocation } from 'react-router-dom';
import './AppLayout.css';

const navItems = [
  { path: '/builder', label: 'Builder' },
  { path: '/preview', label: 'Preview' },
  { path: '/proof', label: 'Proof' },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="app-nav">
        <Link to="/" className="app-nav-brand">
          AI Resume Builder
        </Link>
        <nav className="app-nav-links">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`app-nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
