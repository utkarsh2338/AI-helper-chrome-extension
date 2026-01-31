import { useState, useEffect } from 'react'
import './Response.css'

function Response({ context }) {
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (context && context.question) {
            fetchResponse()
        }
    }, [context])

    const fetchResponse = async () => {
        setIsLoading(true)
        setError('')
        setResponse('')

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ context }),
            })

            if (res.ok) {
                const data = await res.json()
                setResponse(data.answer)
            } else {
                const errorData = await res.json()
                setError(errorData.error || 'Failed to get response')
            }
        } catch (err) {
            setError('Failed to connect to the server. Make sure the backend is running.')
            console.error('Fetch error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(response)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRetry = () => {
        fetchResponse()
    }

    return (
        <div className="response-container">
            <div className="response-card">
                {/* Question Section */}
                {context ? (
                    <div className="question-section">
                        <div className="section-header">
                            <span className="section-icon">❓</span>
                            <h3>Your Question</h3>
                        </div>
                        <div className="question-content">
                            <p className="question-text">{context.question}</p>
                            <div className="context-info">
                                <span className="context-badge">
                                    🌐 {context.domain}
                                </span>
                                {context.label && (
                                    <span className="context-badge">
                                        🏷️ {context.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>No Question Yet</h3>
                        <p>Select text on any webpage and click "Ask Shukla" to get AI-powered answers.</p>
                        <div className="how-to-use">
                            <h4>How to use:</h4>
                            <ol>
                                <li>Go to any website</li>
                                <li>Select text (question or form field)</li>
                                <li>Click the "✨ Ask Shukla" button</li>
                                <li>View your response here!</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* Response Section */}
                {context && (
                    <div className="answer-section">
                        <div className="section-header">
                            <span className="section-icon">✨</span>
                            <h3>AI Response</h3>
                        </div>

                        {isLoading && (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Generating response...</p>
                            </div>
                        )}

                        {error && (
                            <div className="error-state">
                                <span className="error-icon">❌</span>
                                <p>{error}</p>
                                <button onClick={handleRetry} className="btn btn-retry">
                                    🔄 Retry
                                </button>
                            </div>
                        )}

                        {response && !isLoading && (
                            <div className="response-content">
                                <div className="response-text">
                                    {response}
                                </div>
                                <div className="response-actions">
                                    <button onClick={handleCopy} className="btn btn-copy">
                                        {copied ? '✓ Copied!' : '📋 Copy'}
                                    </button>
                                    <button onClick={handleRetry} className="btn btn-regenerate">
                                        🔄 Regenerate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Response
