import { useState, useEffect } from 'react'
import Settings from './components/Settings'
import Response from './components/Response'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('settings')
  const [queryContext, setQueryContext] = useState(null)

  useEffect(() => {
    // Check for query parameter from extension
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('query')

    if (query) {
      try {
        const context = JSON.parse(decodeURIComponent(query))
        setQueryContext(context)
        setActiveTab('response')
        // Clear the URL params without refreshing
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('Failed to parse query:', error)
      }
    }
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🔮 Contextly</h1>
        <nav className="tabs">
          <button
            className={activeTab === 'response' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('response')}
          >
            💬 Response
          </button>
          <button
            className={activeTab === 'settings' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className={activeTab === 'about' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </nav>
      </header>
      <main className="main">
        {activeTab === 'response' && <Response context={queryContext} />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'about' && (
          <div className="about">
            <h2>About Contextly</h2>
            <p>Contextly is a context-aware assistant for filling internship application forms.</p>
            <p>It uses Google's Gemini AI to provide intelligent, context-based suggestions.</p>
            <h3>Features</h3>
            <ul>
              <li>Context-aware form filling assistance</li>
              <li>BYOK (Bring Your Own Key) support</li>
              <li>Privacy-focused design</li>
              <li>Works across all websites</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
