import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message?: string;
  status: string;
  createdAt: string;
  sessionId?: string;
  imageUrl?: string;
  audioClipId?: string;
}

interface NotificationsViewProps {
  notifications: Notification[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
}

function NotificationsView({ notifications, onClearAll, onDismiss }: NotificationsViewProps) {
  const navigate = useNavigate();

  const handleOpenSession = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>🔔 Notifications</h1>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll} 
            className="btn btn-secondary"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="page-content">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications yet.</p>
            <p className="empty-state-hint">
              Notifications appear as toast messages in the bottom-left corner when they arrive.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-card">
                <div className="notification-card-header">
                  <strong>{notification.title}</strong>
                  <span className={`notification-status status-${notification.status}`}>
                    {notification.status}
                  </span>
                </div>
                {notification.message && (
                  <div className="notification-message">{notification.message}</div>
                )}
                {notification.imageUrl && (
                  <img 
                    className="notification-image" 
                    src={notification.imageUrl} 
                    alt="Notification" 
                    loading="lazy"
                  />
                )}
                <div className="notification-meta">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
                <div className="notification-actions">
                  {notification.sessionId && (
                    <button 
                      onClick={() => handleOpenSession(notification.sessionId!)}
                      className="btn btn-primary btn-sm"
                    >
                      Open
                    </button>
                  )}
                  <button 
                    onClick={() => onDismiss(notification.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsView;
