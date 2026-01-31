const BACKEND_URL = 'http://localhost:3000';

let aiButton;
let sidePanel;
let lastSelection = "";

// Create the side panel
function createSidePanel() {
    if (sidePanel) return sidePanel;

    sidePanel = document.createElement('div');
    sidePanel.id = 'ai-helper-panel';
    sidePanel.innerHTML = `
        <div class="ai-panel-header">
            <div class="ai-header-left">
                <div class="ai-logo-pulse"></div>
                <h2>Contextly</h2>
            </div>
            <div class="ai-header-right">
                <button class="ai-panel-close" id="ai-panel-close" title="Close">✕</button>
            </div>
        </div>
        
        <div class="ai-panel-body" id="ai-panel-body">
            <div class="ai-panel-content">
                <div class="ai-panel-section ai-question-section">
                    <div class="ai-section-header">
                        <div class="ai-section-icon-wrapper">
                            <span class="ai-section-icon">❓</span>
                        </div>
                        <h3>Your Question</h3>
                        <span class="ai-char-count" id="ai-char-count">0 chars</span>
                    </div>
                    <div class="ai-question-box" id="ai-question-text"></div>
                </div>
                
                <div class="ai-panel-section ai-response-section">
                    <div class="ai-section-header">
                        <div class="ai-section-icon-wrapper ai-sparkle">
                            <span class="ai-section-icon">✨</span>
                        </div>
                        <h3>AI Response</h3>
                        <div class="ai-response-meta" id="ai-response-meta" style="display: none;">
                            <span class="ai-response-time" id="ai-response-time"></span>
                        </div>
                    </div>
                    <div class="ai-response-box" id="ai-response-content">
                        <div class="ai-loading" id="ai-loading">
                            <div class="ai-loading-animation">
                                <div class="ai-dot"></div>
                                <div class="ai-dot"></div>
                                <div class="ai-dot"></div>
                            </div>
                            <p>Thinking<span class="ai-ellipsis"></span></p>
                            <div class="ai-loading-tips">
                                <span id="ai-loading-tip">💡 Tip: You can press ESC to close the panel</span>
                            </div>
                        </div>
                        <div class="ai-error" id="ai-error" style="display: none;">
                            <div class="ai-error-icon">😵</div>
                            <p id="ai-error-text"></p>
                            <button class="ai-btn ai-btn-retry" id="ai-retry-btn">
                                <span class="ai-btn-icon">🔄</span>
                                <span>Try Again</span>
                            </button>
                        </div>
                        <div class="ai-result" id="ai-result" style="display: none;">
                            <div class="ai-result-text" id="ai-result-text"></div>
                            <div class="ai-result-toolbar">
                                <div class="ai-word-count" id="ai-word-count"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="ai-actions-bar" id="ai-actions-bar" style="display: none;">
                <button class="ai-action-btn" id="ai-copy-btn" title="Copy to clipboard">
                    <span class="ai-action-icon">📋</span>
                    <span class="ai-action-label">Copy</span>
                </button>
                <button class="ai-action-btn" id="ai-regen-btn" title="Regenerate response">
                    <span class="ai-action-icon">🔄</span>
                    <span class="ai-action-label">Regenerate</span>
                </button>
            </div>
        </div>
        
        <div class="ai-panel-footer">
            <div class="ai-footer-left">
                <a href="http://localhost:5173" target="_blank" class="ai-settings-link">
                    <span>⚙️</span>
                    <span>Settings</span>
                </a>
            </div>
        </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes ai-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes ai-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        @keyframes ai-spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes ai-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        
        @keyframes ai-slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes ai-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes ai-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes ai-glow {
            0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
            50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes ai-typing {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes ai-ellipsis {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
        }
        
        @keyframes ai-sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.2) rotate(-5deg); }
            50% { transform: scale(1) rotate(5deg); }
            75% { transform: scale(1.1) rotate(-3deg); }
        }

        #ai-helper-panel {
            position: fixed;
            top: 0;
            right: -450px;
            width: 420px;
            height: 100vh;
            background: linear-gradient(135deg, #0f172a, #020617);
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5), -5px 0 20px rgba(99, 102, 241, 0.2);
            z-index: 2147483647;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            overflow: hidden;
        }

        #ai-helper-panel.open {
            right: 0;
            animation: ai-slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        #ai-helper-panel.minimized {
            height: auto;
            top: auto;
            bottom: 20px;
            right: 20px;
            width: auto;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        #ai-helper-panel.minimized .ai-panel-header,
        #ai-helper-panel.minimized .ai-panel-body,
        #ai-helper-panel.minimized .ai-panel-footer {
            display: none;
        }
        
        #ai-helper-panel.minimized .ai-minimized-bar {
            display: flex;
        }

        #ai-helper-panel.light-theme {
            background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%);
        }
        
        #ai-helper-panel.light-theme .ai-panel-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        
        #ai-helper-panel.light-theme .ai-question-box,
        #ai-helper-panel.light-theme .ai-response-box {
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba(99, 102, 241, 0.2);
            color: #1e293b;
        }
        
        #ai-helper-panel.light-theme .ai-result-text {
            color: #334155;
        }
        
        #ai-helper-panel.light-theme .ai-section-header h3 {
            color: #6366f1;
        }
        
        #ai-helper-panel.light-theme .ai-context-bar {
            background: rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.2);
        }
        
        #ai-helper-panel.light-theme .ai-context-text {
            color: #475569;
        }
        
        #ai-helper-panel.light-theme .ai-panel-footer {
            background: rgba(255, 255, 255, 0.8);
            border-color: rgba(99, 102, 241, 0.2);
        }

        #ai-helper-panel * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Header */
        .ai-panel-header {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            position: relative;
            overflow: hidden;
        }
        
        .ai-panel-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: ai-shimmer 3s infinite;
        }
        
        .ai-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .ai-logo-pulse {
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #10b981, #06b6d4);
            border-radius: 50%;
            animation: ai-pulse 2s ease-in-out infinite;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }

        .ai-panel-header h2 {
            color: white;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #fff, #a5b4fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .ai-header-right {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .ai-theme-toggle, .ai-minimize-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .ai-theme-toggle:hover, .ai-minimize-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .ai-theme-icon {
            transition: transform 0.3s ease;
        }
        
        .ai-theme-toggle:hover .ai-theme-icon {
            transform: rotate(20deg);
        }

        .ai-panel-close {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .ai-panel-close:hover {
            background: rgba(239, 68, 68, 0.4);
            transform: scale(1.1) rotate(90deg);
        }
        
        /* Context Bar */
        .ai-context-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: rgba(99, 102, 241, 0.1);
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
            animation: ai-fadeIn 0.5s ease;
        }
        
        .ai-context-icon {
            font-size: 14px;
        }
        
        .ai-context-text {
            font-size: 12px;
            color: #a5b4fc;
            font-weight: 500;
        }
        
        /* Panel Body */
        .ai-panel-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .ai-panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .ai-panel-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .ai-panel-content::-webkit-scrollbar-track {
            background: rgba(99, 102, 241, 0.1);
        }
        
        .ai-panel-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 3px;
        }

        .ai-panel-section {
            margin-bottom: 20px;
            animation: ai-fadeIn 0.5s ease;
        }
        
        .ai-question-section {
            animation-delay: 0.1s;
        }
        
        .ai-response-section {
            animation-delay: 0.2s;
        }

        .ai-section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }
        
        .ai-section-icon-wrapper {
            width: 32px;
            height: 32px;
            background: rgba(15, 23, 42, 0.85);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .ai-section-icon-wrapper.ai-sparkle {
            animation: ai-glow 2s ease-in-out infinite;
        }

        .ai-section-icon {
            font-size: 16px;
        }

        .ai-section-header h3 {
            font-size: 13px;
            font-weight: 700;
            color: #a5b4fc;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            flex: 1;
        }
        
        .ai-char-count {
            font-size: 11px;
            color: #64748b;
            background: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 6px;
        }
        
        .ai-response-meta {
            font-size: 11px;
            color: #10b981;
        }

        .ai-question-box {
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 16px;
            font-size: 14px;
            line-height: 1.7;
            color: #e5e7eb;
            font-weight: 500;
            position: relative;
            overflow: hidden;
        }
        
        .ai-question-box::before {
            content: '"';
            position: absolute;
            top: 8px;
            left: 12px;
            font-size: 40px;
            color: rgba(99, 102, 241, 0.3);
            font-family: Georgia, serif;
            line-height: 1;
        }

        .ai-response-box {
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 16px;
            min-height: 180px;
            position: relative;
        }

        /* Loading Animation */
        .ai-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            gap: 16px;
        }
        
        .ai-loading-animation {
            display: flex;
            gap: 8px;
        }
        
        .ai-dot {
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            animation: ai-bounce 1.4s ease-in-out infinite;
        }
        
        .ai-dot:nth-child(1) { animation-delay: -0.32s; }
        .ai-dot:nth-child(2) { animation-delay: -0.16s; }
        .ai-dot:nth-child(3) { animation-delay: 0s; }

        .ai-loading p {
            color: #a5b4fc;
            font-size: 14px;
            font-weight: 500;
        }
        
        .ai-ellipsis::after {
            content: '';
            animation: ai-ellipsis 1.5s infinite;
        }
        
        .ai-loading-tips {
            margin-top: 10px;
            padding: 10px 16px;
            background: rgba(99, 102, 241, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .ai-loading-tips span {
            font-size: 12px;
            color: #64748b;
        }

        /* Error State */
        .ai-error {
            text-align: center;
            padding: 30px 20px;
            animation: ai-fadeIn 0.3s ease;
        }
        
        .ai-error-icon {
            font-size: 48px;
            margin-bottom: 12px;
            animation: ai-float 2s ease-in-out infinite;
        }

        .ai-error p {
            color: #f87171;
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 1.5;
        }

        /* Result */
        .ai-result {
            animation: ai-fadeIn 0.5s ease;
        }
        
        .ai-result-text {
            font-size: 14px;
            line-height: 1.8;
            color: #e2e8f0;
            white-space: pre-wrap;
            word-wrap: break-word;
            padding-bottom: 12px;
        }
        
        .ai-result-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .ai-word-count {
            font-size: 11px;
            color: #64748b;
        }

        /* Action Bar */
        .ai-actions-bar {
            display: flex;
            gap: 10px;
            padding: 16px 20px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            animation: ai-fadeIn 0.5s ease;
        }
        
        .ai-action-btn {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            background: rgba(99, 102, 241, 0.1);
            color: #a5b4fc;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        
        .ai-action-btn:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .ai-action-btn.ai-action-primary {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            color: white;
        }
        
        .ai-action-btn.ai-action-primary:hover {
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
        }
        
        .ai-action-btn.success {
            background: linear-gradient(135deg, #10b981, #06b6d4) !important;
            border: none !important;
            color: white !important;
        }
        
        .ai-action-icon {
            font-size: 18px;
        }
        
        .ai-action-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .ai-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .ai-btn-icon {
            font-size: 16px;
        }

        .ai-btn-retry {
            background: linear-gradient(135deg, #f59e0b, #f97316);
            color: white;
        }

        .ai-btn-retry:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        /* Footer */
        .ai-panel-footer {
            padding: 12px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ai-settings-link {
            color: #a5b4fc;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            padding: 6px 12px;
            border-radius: 8px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ai-settings-link:hover {
            color: white;
            background: rgba(99, 102, 241, 0.2);
            transform: translateX(3px);
        }
        
        .ai-powered {
            font-size: 11px;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .ai-powered::before {
            content: '⚡';
            font-size: 12px;
        }
        
        /* Minimized Bar */
        .ai-minimized-bar {
            display: none;
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .ai-minimized-bar:hover {
            background: rgba(99, 102, 241, 0.2);
        }
        
        .ai-mini-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .ai-mini-icon {
            font-size: 20px;
            animation: ai-float 2s ease-in-out infinite;
        }
        
        .ai-mini-text {
            color: white;
            font-weight: 600;
            font-size: 14px;
        }
        
        .ai-mini-status {
            font-size: 11px;
            color: #10b981;
            background: rgba(16, 185, 129, 0.2);
            padding: 3px 8px;
            border-radius: 6px;
        }

        /* Overlay */
        #ai-helper-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 2147483646;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        #ai-helper-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        
        /* Responsive */
        @media (max-width: 500px) {
            #ai-helper-panel {
                width: 100%;
                right: -100%;
            }
        }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(sidePanel);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'ai-helper-overlay';
    document.body.appendChild(overlay);

    // Event listeners - use querySelector on sidePanel to ensure elements are found
    const closeBtn = sidePanel.querySelector('#ai-panel-close');
    const copyBtn = sidePanel.querySelector('#ai-copy-btn');
    const regenBtn = sidePanel.querySelector('#ai-regen-btn');
    const retryBtn = sidePanel.querySelector('#ai-retry-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePanel();
        });
    }

    overlay.addEventListener('click', closePanel);

    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopy();
        });
    }

    if (regenBtn) {
        regenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetchAIResponse(currentContext);
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetchAIResponse(currentContext);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidePanel.classList.contains('open')) {
            closePanel();
        }
    });

    return sidePanel;
}

let currentContext = null;
let currentResponse = '';
let lastActiveInput = null;
let responseStartTime = null;

const loadingTips = [
    "💡 Tip: Press ESC to close the panel",
    "💡 Tip: Click 'Copy' to copy response to clipboard",
    "💡 Tip: You can regenerate for different answers",
    "💡 Tip: Configure your API key in Settings",
    "💡 Tip: Select any text to ask AI about it"
];

function openPanel(context) {
    createSidePanel();
    currentContext = context;
    responseStartTime = Date.now();

    // Update question
    document.getElementById('ai-question-text').textContent = context.question;
    document.getElementById('ai-char-count').textContent = `${context.question.length} chars`;

    // Show random tip
    document.getElementById('ai-loading-tip').textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];

    // Reset states
    document.getElementById('ai-loading').style.display = 'flex';
    document.getElementById('ai-error').style.display = 'none';
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('ai-actions-bar').style.display = 'none';
    document.getElementById('ai-response-meta').style.display = 'none';

    // Open panel
    sidePanel.classList.remove('minimized');
    sidePanel.classList.add('open');
    document.getElementById('ai-helper-overlay').classList.add('visible');

    // Fetch response
    fetchAIResponse(context);
}

function closePanel() {
    if (sidePanel) {
        sidePanel.classList.remove('open');
        sidePanel.classList.remove('minimized');
    }
    const overlay = document.getElementById('ai-helper-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
    }
}

async function fetchAIResponse(context) {
    responseStartTime = Date.now();
    document.getElementById('ai-loading').style.display = 'flex';
    document.getElementById('ai-error').style.display = 'none';
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('ai-actions-bar').style.display = 'none';
    document.getElementById('ai-response-meta').style.display = 'none';

    try {
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context })
        });

        if (response.ok) {
            const data = await response.json();
            currentResponse = data.answer;

            const responseTime = ((Date.now() - responseStartTime) / 1000).toFixed(1);
            document.getElementById('ai-response-time').textContent = `⚡ ${responseTime}s`;
            document.getElementById('ai-response-meta').style.display = 'block';

            // Type out the response
            await typeResponse(data.answer);

            const wordCount = data.answer.split(/\s+/).length;
            document.getElementById('ai-word-count').textContent = `${wordCount} words • ${data.answer.length} characters`;

            document.getElementById('ai-loading').style.display = 'none';
            document.getElementById('ai-result').style.display = 'block';
            document.getElementById('ai-actions-bar').style.display = 'flex';
        } else {
            throw new Error('Failed to get response');
        }
    } catch (error) {
        console.error('Contextly Error:', error);
        document.getElementById('ai-loading').style.display = 'none';
        document.getElementById('ai-error-text').textContent = 'Failed to get AI response. Make sure the backend is running on port 3000.';
        document.getElementById('ai-error').style.display = 'block';
    }
}

async function typeResponse(text) {
    const resultElement = document.getElementById('ai-result-text');
    resultElement.textContent = '';

    // Fast typing effect
    const chunkSize = 3;
    for (let i = 0; i < text.length; i += chunkSize) {
        resultElement.textContent += text.slice(i, i + chunkSize);
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

function handleCopy() {
    navigator.clipboard.writeText(currentResponse);
    const btn = document.getElementById('ai-copy-btn');
    btn.classList.add('success');
    btn.querySelector('.ai-action-icon').textContent = '✓';
    btn.querySelector('.ai-action-label').textContent = 'Copied!';
    setTimeout(() => {
        btn.classList.remove('success');
        btn.querySelector('.ai-action-icon').textContent = '📋';
        btn.querySelector('.ai-action-label').textContent = 'Copy';
    }, 2000);
}

function handleInsert() {
    const btn = document.getElementById('ai-insert-btn');
    if (lastActiveInput && (lastActiveInput.tagName === 'TEXTAREA' || lastActiveInput.tagName === 'INPUT')) {
        lastActiveInput.value = currentResponse;
        lastActiveInput.dispatchEvent(new Event('input', { bubbles: true }));
        btn.classList.add('success');
        btn.querySelector('.ai-action-icon').textContent = '✓';
        btn.querySelector('.ai-action-label').textContent = 'Inserted!';
        setTimeout(() => {
            closePanel();
            btn.classList.remove('success');
            btn.querySelector('.ai-action-icon').textContent = '📝';
            btn.querySelector('.ai-action-label').textContent = 'Insert';
        }, 1000);
    } else {
        btn.querySelector('.ai-action-icon').textContent = '❌';
        btn.querySelector('.ai-action-label').textContent = 'No field';
        setTimeout(() => {
            btn.querySelector('.ai-action-icon').textContent = '📝';
            btn.querySelector('.ai-action-label').textContent = 'Insert';
        }, 2000);
    }
}

function showButton(x, y) {
    if (!aiButton) {
        aiButton = document.createElement("button");
        aiButton.id = 'ai-helper-button';
        aiButton.innerHTML = `<span style="margin-right: 6px;">✨</span>Ask Shukla`;
        aiButton.style.cssText = `
            position: absolute;
            z-index: 2147483645;
            padding: 10px 18px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
            background-size: 200% 200%;
            color: white;
            border-radius: 25px;
            border: none;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: ai-float 3s ease-in-out infinite;
            display: flex;
            align-items: center;
        `;
        document.body.appendChild(aiButton);

        aiButton.addEventListener("mouseenter", () => {
            aiButton.style.transform = "translateY(-3px) scale(1.05)";
            aiButton.style.boxShadow = "0 8px 30px rgba(99, 102, 241, 0.6), 0 0 0 1px rgba(255,255,255,0.2) inset";
        });

        aiButton.addEventListener("mouseleave", () => {
            aiButton.style.transform = "translateY(0) scale(1)";
            aiButton.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset";
        });

        aiButton.addEventListener("click", () => {
            if (lastSelection.length > 5) {
                const context = {
                    question: lastSelection,
                    pageTitle: document.title,
                    domain: window.location.hostname,
                    label: null,
                    placeholder: null
                };

                if (lastActiveInput && (lastActiveInput.tagName === "TEXTAREA" || lastActiveInput.tagName === "INPUT")) {
                    if (lastActiveInput.id) {
                        const label = document.querySelector(`label[for="${lastActiveInput.id}"]`);
                        context.label = label?.innerText || null;
                    }
                    context.placeholder = lastActiveInput.placeholder || null;
                }

                openPanel(context);
            }
            aiButton.style.display = "none";
        });
    }

    aiButton.style.top = y + "px";
    aiButton.style.left = x + "px";
    aiButton.style.display = "flex";
}

document.addEventListener("mouseup", (e) => {
    // Don't trigger if clicking inside the panel
    if (e.target.closest('#ai-helper-panel') || e.target.closest('#ai-helper-button')) {
        return;
    }

    const text = window.getSelection().toString().trim();
    lastSelection = text;

    // Save reference to active input
    if (document.activeElement && (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT")) {
        lastActiveInput = document.activeElement;
    }

    if (text.length > 5) {
        showButton(e.pageX, e.pageY);
    } else if (aiButton) {
        aiButton.style.display = "none";
    }
});
