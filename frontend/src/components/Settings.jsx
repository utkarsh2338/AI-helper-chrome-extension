import { useState, useEffect } from 'react'
import './Settings.css'

function Settings() {
    const [apiKey, setApiKey] = useState('')
    const [savedKey, setSavedKey] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Load saved API key from backend
        fetchSavedKey()
    }, [])

    const fetchSavedKey = async () => {
        try {
            const response = await fetch('/api/settings/apikey')
            if (response.ok) {
                const data = await response.json()
                if (data.hasKey) {
                    setSavedKey('••••••••••••••••••••')
                    setMessage('API key is configured')
                }
            }
        } catch (error) {
            console.error('Failed to fetch API key status:', error)
        }
    }

    const handleSave = async () => {
        if (!apiKey.trim()) {
            setMessage('Please enter an API key')
            return
        }

        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/settings/apikey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            })

            if (response.ok) {
                setSavedKey('••••••••••••••••••••')
                setApiKey('')
                setMessage('API key saved successfully!')
                setTimeout(() => setMessage(''), 3000)
            } else {
                const error = await response.json()
                setMessage(error.error || 'Failed to save API key')
            }
        } catch (error) {
            setMessage('Failed to save API key. Please try again.')
            console.error('Save error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTest = async () => {
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/test-key', {
                method: 'POST',
            })

            if (response.ok) {
                setMessage('✅ API key is valid and working!')
                setTimeout(() => setMessage(''), 5000)
            } else {
                const error = await response.json()
                setMessage('❌ ' + (error.error || 'API key test failed'))
            }
        } catch (error) {
            setMessage('❌ Failed to test API key')
            console.error('Test error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = async () => {
        if (!confirm('Are you sure you want to remove your API key?')) {
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/settings/apikey', {
                method: 'DELETE',
            })

            if (response.ok) {
                setSavedKey('')
                setApiKey('')
                setMessage('API key removed successfully')
                setTimeout(() => setMessage(''), 3000)
            }
        } catch (error) {
            setMessage('Failed to remove API key')
            console.error('Delete error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="settings">
            <div className="settings-card">
                <h2>BYOK (Bring Your Own Key)</h2>
                <p className="settings-description">
                    Use your own Google Gemini API key. Get a free API key from{' '}
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                    >
                        Google AI Studio
                    </a>
                </p>

                <div className="form-group">
                    <label htmlFor="apiKey">Gemini API Key</label>
                    <div className="input-group">
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="input"
                            disabled={isLoading}
                        />
                    </div>
                    {savedKey && (
                        <div className="saved-key">
                            Current key: <span className="key-mask">{savedKey}</span>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="button-group">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !apiKey.trim()}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Saving...' : 'Save API Key'}
                    </button>

                    {savedKey && (
                        <>
                            <button
                                onClick={handleTest}
                                disabled={isLoading}
                                className="btn btn-secondary"
                            >
                                {isLoading ? 'Testing...' : 'Test Key'}
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={isLoading}
                                className="btn btn-danger"
                            >
                                Remove Key
                            </button>
                        </>
                    )}
                </div>

                <div className="info-box">
                    <h3>How to get a free Gemini API key:</h3>
                    <ol>
                        <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                        <li>Sign in with your Google account</li>
                        <li>Click "Create API Key"</li>
                        <li>Copy the key and paste it above</li>
                    </ol>
                    <p className="note">
                        <strong>Note:</strong> Your API key is stored securely on the backend server and never exposed to the extension or frontend.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Settings
