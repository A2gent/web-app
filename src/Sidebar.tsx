import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'sessions', label: 'Sessions', path: '/sessions' },
  { id: 'jobs', label: 'Recurring jobs', path: '/agent/jobs' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-title-link">
        <h2 className="sidebar-title">A2gent</h2>
      </Link>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
