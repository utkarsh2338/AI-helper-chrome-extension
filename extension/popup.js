const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';

// Check backend connection
async function checkConnection() {
    const statusEl = document.getElementById('status');
    const statusText = statusEl.querySelector('.status-text');

    try {
        const response = await fetch(`${BACKEND_URL}/settings/apikey`);
        if (response.ok) {
            const data = await response.json();
            statusEl.className = 'status connected';
            if (data.hasKey) {
                statusText.textContent = 'Connected • API Key configured ✓';
            } else {
                statusText.textContent = 'Connected • No API Key set';
            }
        } else {
            throw new Error('Backend not responding');
        }
    } catch (error) {
        statusEl.className = 'status disconnected';
        statusText.textContent = 'Backend not running';
    }
}

// Open settings in new tab
document.getElementById('openSettings').addEventListener('click', () => {
    chrome.tabs.create({ url: FRONTEND_URL });
});

// Check connection on popup open
checkConnection();
