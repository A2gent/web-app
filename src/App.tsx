import Sidebar from './Sidebar'
import ChatInput from './ChatInput'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="chat-history">
          <h1>Agent Chat Panel</h1>
          <p>This is the main chat area. Messages will appear here and the area will scroll.</p>
          <p>The expandable menu is on the left.</p>
        </div>
        <ChatInput />
      </div>
    </div>
  )
}

export default App
