// AxiomAI Content Script - Button-triggered analysis
const API_URL = 'https://ritesh1918-axiom-backend.hf.space';

function createWidget() {
    const existing = document.getElementById('axiom-widget');
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.id = 'axiom-widget';
    widget.innerHTML = `
        <div class="axiom-toggle" id="axiom-toggle">
            <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="AxiomAI" class="axiom-icon">
        </div>
        <div class="axiom-panel" id="axiom-panel">
            <div class="axiom-header">
                <div class="axiom-title">
                    <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="" class="axiom-logo">
                    <span>AxiomAI Router</span>
                </div>
                <button class="axiom-close" id="axiom-close">×</button>
            </div>
            <div class="axiom-body">
                <div class="axiom-input-section">
                    <p class="axiom-hint">Click "Check" to analyze your current prompt</p>
                    <div class="axiom-char-count" id="axiom-char-count">0 chars detected</div>
                    <button class="axiom-check-btn" id="axiom-check-btn">🔍 Check Prompt</button>
                </div>
                <div class="axiom-result" id="axiom-result" style="display: none;">
                    <div class="axiom-tier" id="axiom-tier">-</div>
                    <div class="axiom-stats">
                        <div class="axiom-stat">
                            <span class="axiom-stat-label">Confidence</span>
                            <span class="axiom-stat-value" id="axiom-confidence">-</span>
                        </div>
                        <div class="axiom-stat">
                            <span class="axiom-stat-label">Method</span>
                            <span class="axiom-stat-value" id="axiom-method">-</span>
                        </div>
                    </div>
                    <div class="axiom-explanation" id="axiom-explanation"></div>
                </div>
                <div class="axiom-status" id="axiom-status" style="display: none;">
                    <div class="axiom-status-dot analyzing"></div>
                    <span>Analyzing...</span>
                </div>
            </div>
            <div class="axiom-footer">
                <span>AxiomAI v1.0</span>
                <a href="https://axiomai1918.vercel.app/dashboard.html" target="_blank" class="axiom-dashboard-link">📊 Dashboard</a>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Toggle panel
    document.getElementById('axiom-toggle').addEventListener('click', () => {
        widget.classList.toggle('expanded');
    });

    document.getElementById('axiom-close').addEventListener('click', () => {
        widget.classList.remove('expanded');
    });

    // Check button
    document.getElementById('axiom-check-btn').addEventListener('click', () => {
        const promptText = getPromptText();
        if (promptText && promptText.length >= 3) {
            analyzePrompt(promptText);
        } else {
            showError('Please type something in the chat first!');
        }
    });

    // Char count poller
    setInterval(() => {
        if (widget.classList.contains('expanded')) {
            const text = getPromptText();
            const len = text ? text.length : 0;
            const counter = document.getElementById('axiom-char-count');
            if (counter) {
                counter.textContent = `${len} chars detected`;
                counter.style.color = len > 0 ? '#10b981' : 'rgba(255,255,255,0.5)';
            }
        }
    }, 1000);

    return widget;
}

// Get text from chatbot input
function getPromptText() {
    const selectors = [
        'textarea#prompt-textarea',
        'textarea[data-id="root"]',
        'div[contenteditable="true"][data-placeholder]',
        'textarea[placeholder*="Message"]',
        'div.ProseMirror',
        'textarea'
    ];

    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
            const text = el.value || el.innerText || el.textContent;
            if (text && text.trim().length > 0) {
                return text.trim();
            }
        }
    }
    return null;
}

function showError(msg) {
    const resultEl = document.getElementById('axiom-result');
    resultEl.style.display = 'block';
    document.getElementById('axiom-tier').textContent = '⚠️ ' + msg;
    document.getElementById('axiom-tier').className = 'axiom-tier';
    document.getElementById('axiom-confidence').textContent = '-';
    document.getElementById('axiom-method').textContent = '-';
    document.getElementById('axiom-explanation').textContent = '';
}

async function analyzePrompt(text) {
    const btn = document.getElementById('axiom-check-btn');
    const statusEl = document.getElementById('axiom-status');
    const resultEl = document.getElementById('axiom-result');

    btn.disabled = true;
    btn.textContent = '⏳ Analyzing...';
    statusEl.style.display = 'flex';
    resultEl.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/v1/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();

        updateUI({
            'Recommended Tier': data.selected_tier === 'large_llm' ? '🔥 LARGE LLM' : '⚡ SMALL LLM',
            'Confidence': (data.confidence * 100).toFixed(1) + '%',
            'Method': 'ML Model',
            'Explanation': data.routing_reason
        });

    } catch (error) {
        console.error('AxiomAI:', error);
        // Fallback
        const isLarge = text.length > 150;
        updateUI({
            'Recommended Tier': isLarge ? '🔥 LARGE LLM' : '⚡ SMALL LLM',
            'Confidence': 'Note: Offline Mode',
            'Method': 'Local Rule',
            'Explanation': 'Backend unreachable'
        });
    } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Check Prompt';
        statusEl.style.display = 'none';
    }
}


function updateUI(result) {
    const resultEl = document.getElementById('axiom-result');
    resultEl.style.display = 'block';

    const tierEl = document.getElementById('axiom-tier');
    tierEl.textContent = result['Recommended Tier'];
    tierEl.className = 'axiom-tier ' + (result['Recommended Tier'].includes('LARGE') ? 'large' : 'small');

    document.getElementById('axiom-confidence').textContent = result['Confidence'];
    document.getElementById('axiom-method').textContent = result['Method'] || 'ML';
    document.getElementById('axiom-explanation').textContent = result['Explanation'] || '';
}

// Listen for settings updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'AXIOM_SETTINGS_UPDATED') {
        // Apply settings if needed (e.g., update thresholds or toggle widget)
        console.log('Axiom Settings Updated:', request.settings);
        if (request.settings.enabled === false) {
            const widget = document.getElementById('axiom-widget');
            if (widget) widget.style.display = 'none';
        } else {
            const widget = document.getElementById('axiom-widget');
            if (widget) widget.style.display = 'block';
        }
    }
});

// Initialize
createWidget();
console.log('AxiomAI Router loaded on', window.location.hostname);
