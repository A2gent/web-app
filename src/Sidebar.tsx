import React, { useState } from 'react';
import type { Session } from './api';

interface NavItem {
  id: string;
  label: string;
  path: string;
  subItems?: NavItem[];
}

interface SidebarProps {
  sessions: Session[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const navItems: NavItem[] = [
  { id: 'mind', label: 'My mind', path: '/mind' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  {
    id: 'agent',
    label: 'Agent',
    path: '/agent',
    subItems: [
      { id: 'persona', label: 'Persona', path: '/agent/persona' },
      { id: 'thoughts', label: 'Thoughts', path: '/agent/thoughts' },
      { id: 'jobs', label: 'Recurring jobs', path: '/agent/jobs' },
      { id: 'datasources', label: 'Datasources', path: '/agent/datasources' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onCreateSession,
  onDeleteSession 
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>('sessions');

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const formatSessionTitle = (session: Session) => {
    if (session.title) {
      return session.title.length > 25 
        ? session.title.substring(0, 25) + '...' 
        : session.title;
    }
    return `Session ${session.id.substring(0, 8)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNavItems = (items: NavItem[], isSub?: boolean) => {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: isSub ? '20px' : '0', margin: '0' }}>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: '2px' }}>
            <div
              style={{
                cursor: 'pointer',
                fontWeight: item.subItems ? 'bold' : 'normal',
                padding: '8px 5px',
                borderRadius: '4px',
                backgroundColor: isSub ? '#3a3a3a' : 'inherit',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onClick={() => item.subItems ? toggleExpand(item.id) : console.log(`Navigating to ${item.path}`)}
            >
              {item.label}
              {item.subItems && (
                <span style={{ marginLeft: '10px', transition: 'transform 0.2s', fontSize: '12px' }}>
                  {expandedItem === item.id ? '▼' : '▶'}
                </span>
              )}
            </div>
            {item.subItems && expandedItem === item.id && (
              renderNavItems(item.subItems, true)
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">A2gent</h2>
      
      {/* Sessions Section */}
      <div className="sidebar-section">
        <div 
          className="sidebar-section-header"
          onClick={() => toggleExpand('sessions')}
        >
          <span>Sessions</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="new-session-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCreateSession();
              }}
              title="New Session"
            >
              +
            </button>
            <span style={{ fontSize: '12px' }}>
              {expandedItem === 'sessions' ? '▼' : '▶'}
            </span>
          </div>
        </div>
        
        {expandedItem === 'sessions' && (
          <ul className="session-list">
            {sessions.length === 0 ? (
              <li className="session-item empty">No sessions yet</li>
            ) : (
              sessions.map(session => (
                <li 
                  key={session.id} 
                  className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                >
                  <div 
                    className="session-item-content"
                    onClick={() => onSelectSession(session.id)}
                  >
                    <span className="session-item-title">{formatSessionTitle(session)}</span>
                    <span className="session-item-meta">
                      <span className={`status-dot status-${session.status}`}></span>
                      {formatDate(session.updated_at)}
                    </span>
                  </div>
                  <button 
                    className="session-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this session?')) {
                        onDeleteSession(session.id);
                      }
                    }}
                    title="Delete session"
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Navigation Section */}
      <div className="sidebar-section">
        <nav>
          {renderNavItems(navItems)}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
