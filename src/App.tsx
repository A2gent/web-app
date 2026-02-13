import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SessionsList from './SessionsList';
import JobsList from './JobsList';
import JobEdit from './JobEdit';
import JobDetail from './JobDetail';
import ChatView from './ChatView';
import './App.css';

// Wrapper component to use navigate hook
function SessionsListWrapper() {
  const navigate = useNavigate();
  
  const handleSelectSession = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  const handleCreateSession = () => {
    navigate('/chat');
  };

  return (
    <SessionsList 
      onSelectSession={handleSelectSession}
      onCreateSession={handleCreateSession}
    />
  );
}

function App() {
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Redirect root to sessions */}
            <Route path="/" element={<Navigate to="/sessions" replace />} />
            
            {/* Sessions List */}
            <Route path="/sessions" element={<SessionsListWrapper />} />
            
            {/* Chat View - for a specific session or new session */}
            <Route 
              path="/chat/:sessionId?" 
              element={
                <ChatView 
                  currentSessionId={currentSessionId}
                  onSessionChange={setCurrentSessionId}
                />
              } 
            />
            
            {/* Jobs Routes */}
            <Route path="/agent/jobs" element={<JobsList />} />
            <Route path="/agent/jobs/new" element={<JobEdit />} />
            <Route path="/agent/jobs/edit/:jobId" element={<JobEdit />} />
            <Route path="/agent/jobs/:jobId" element={<JobDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
