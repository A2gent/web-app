import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { 
  getSession, 
  createSession, 
  sendMessage,
  type Session, 
  type Message 
} from './api';

interface ChatViewProps {
  currentSessionId?: string;
  onSessionChange: (sessionId: string | undefined) => void;
}

function ChatView({ currentSessionId, onSessionChange }: ChatViewProps) {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use URL param if provided, otherwise use prop
  const activeSessionId = urlSessionId || currentSessionId;

  useEffect(() => {
    if (activeSessionId) {
      loadSession(activeSessionId);
    } else {
      setSession(null);
      setMessages([]);
    }
  }, [activeSessionId]);

  const loadSession = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSession(id);
      setSession(data);
      setMessages(data.messages || []);
      onSessionChange(id);
    } catch (err) {
      console.error('Failed to load session:', err);
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (initialMessage?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createSession({ 
        agent_id: 'build', 
        task: initialMessage 
      });
      
      if (initialMessage) {
        // Get the full session with initial messages
        const newSession = await getSession(response.id);
        setSession(newSession);
        setMessages(newSession.messages || []);
        onSessionChange(response.id);
      } else {
        setSession({
          id: response.id,
          agent_id: response.agent_id,
          title: '',
          status: response.status,
          created_at: response.created_at,
          updated_at: response.created_at,
          messages: []
        });
        setMessages([]);
        onSessionChange(response.id);
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!session) {
      // Create a new session with this message
      await handleCreateSession(message);
      return;
    }

    // Add user message optimistically
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(session.id, message);
      setMessages(response.messages);
      
      // Update session status
      setSession(prev => prev ? { ...prev, status: response.status } : null);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the optimistic message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="session-info">
          {session ? (
            <>
              <span className="session-title">{session.title || 'Untitled Session'}</span>
              <span className={`session-status status-${session.status}`}>
                {session.status}
              </span>
            </>
          ) : (
            <span className="session-title">New Session</span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)} className="error-dismiss">×</button>
        </div>
      )}
      
      <div className="chat-history">
        {messages.length > 0 ? (
          <MessageList messages={messages} isLoading={isLoading} />
        ) : (
          <div className="empty-state">
            <h2>Start a Conversation</h2>
            <p>Type a message below to begin chatting with the agent.</p>
          </div>
        )}
      </div>
      
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </>
  );
}

export default ChatView;
