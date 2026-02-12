import React, { useEffect, useRef } from 'react';
import type { Message, ToolCall, ToolResult } from './api';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderToolCalls = (toolCalls: ToolCall[]) => {
    return (
      <div className="tool-calls">
        {toolCalls.map((tc) => (
          <div key={tc.id} className="tool-call">
            <div className="tool-call-header">
              <span className="tool-icon">⚙</span>
              <span className="tool-name">{tc.name}</span>
            </div>
            <pre className="tool-input">{JSON.stringify(tc.input, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  const renderToolResults = (toolResults: ToolResult[]) => {
    return (
      <div className="tool-results">
        {toolResults.map((tr) => (
          <div key={tr.tool_call_id} className={`tool-result ${tr.is_error ? 'error' : ''}`}>
            <div className="tool-result-header">
              <span className={tr.is_error ? 'result-icon-error' : 'result-icon'}>
                {tr.is_error ? '✗' : '✓'}
              </span>
              <span>Result</span>
            </div>
            <pre className="tool-result-content">{tr.content}</pre>
          </div>
        ))}
      </div>
    );
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message message-${message.role}`}>
          <div className="message-header">
            <span className="message-role">
              {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Agent' : 'Tool'}
            </span>
            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          {message.content && (
            <div className="message-content">
              {formatContent(message.content)}
            </div>
          )}
          
          {message.tool_calls && message.tool_calls.length > 0 && renderToolCalls(message.tool_calls)}
          {message.tool_results && message.tool_results.length > 0 && renderToolResults(message.tool_results)}
        </div>
      ))}
      
      {isLoading && (
        <div className="message message-loading">
          <div className="loading-indicator">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
          <span>Agent is thinking...</span>
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
