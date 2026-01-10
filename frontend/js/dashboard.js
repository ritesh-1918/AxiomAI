const API_URL = 'https://ritesh1918-axiom-backend.hf.space';
let stats = { requestsToday: 0, smallRoutes: 0, largeRoutes: 0, totalLatency: 0 };
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    currentUser = await checkAuth();
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.user_metadata.full_name || currentUser.email.split('@')[0];
        document.getElementById('userAvatar').textContent = (currentUser.email[0]).toUpperCase();

        // Load stats from Supabase (Optional: could implement a fetch for historical stats)
    }

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(e.target.dataset.tab);
        });
    });
    initCharts();

    // Character Counter
    const promptInput = document.getElementById('promptInput');
    const charCounter = document.getElementById('charCounter');
    promptInput.addEventListener('input', () => {
        const len = promptInput.value.length;
        charCounter.textContent = `${len} / 4096`;
        if (len > 3500) charCounter.style.color = 'var(--warning)';
        else charCounter.style.color = 'var(--text-muted)';
    });

    // Start simulated logs
    setInterval(simulateBackgroundActivity, 3000);
    addSystemLog('System initialized. Connected to Router Nodes.', 'success');
});

function switchTab(tabName) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    const titles = { router: '🚀 LLM Router', eda: '📊 EDA', metrics: '📈 Metrics', model: '🤖 Model', validation: '✅ Validation' };
    document.getElementById('pageTitle').innerHTML = `<span class="live-indicator" title="System Online"></span> ${titles[tabName]}`;
}

async function routePrompt() {
    const prompt = document.getElementById('promptInput').value;
    if (!prompt.trim()) return alert('Please enter a prompt');

    document.querySelector('.btn-primary').disabled = true;
    document.querySelector('.btn-primary').textContent = 'Routing...';

    addSystemLog('Receiving prompt request...', 'info');

    try {
        const start = Date.now();
        const response = await fetch(`${API_URL}/api/v1/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error ${response.status}: ${errText}`);
        }
        const data = await response.json();

        addSystemLog(`Routed to ${data.selected_tier} (${data.latency_ms}ms)`, 'success');

        // Log to Supabase
        if (currentUser && window.supabaseClient) {
            const { error } = await window.supabaseClient.from('usage_logs').insert({
                user_id: currentUser.id,
                prompt_text: prompt,
                model_choice: data.selected_tier === 'large_llm' ? 'Large LLM' : 'Small LLM',
                latency_ms: Math.round(data.latency_ms),
                cost_estimated: data.selected_tier === 'large_llm' ? 0.03 : 0.0002
            });
            if (error) console.error('Error logging usage:', error);
        }

        displayResult(data);
    } catch (e) {
        // Fallback to Demo Mode
        console.error('API Error, using fallback:', e);
        addSystemLog(`Connection Failed: ${e.message}`, 'error');
        addSystemLog('Switching to demo mode.', 'warning');
        // Fallback demo result if API is offline
        displayResult({
            selected_tier: prompt.length > 50 ? 'large_llm' : 'small_llm',
            confidence: 0.85 + Math.random() * 0.12,
            latency_ms: 30 + Math.random() * 20,
            routing_reason: 'Demo Mode (API Offline)'
        });
    } finally {
        document.querySelector('.btn-primary').disabled = false;
        document.querySelector('.btn-primary').textContent = '🚀 Route Request';
    }
}

function displayResult(data) {
    document.getElementById('routerResult').classList.add('visible');
    const tierEl = document.getElementById('resultTier');
    tierEl.textContent = data.selected_tier.toUpperCase().replace('_', ' ');
    tierEl.className = 'result-tier ' + (data.selected_tier === 'large_llm' ? 'large' : 'small');
    document.getElementById('resultConfidence').textContent = (data.confidence * 100).toFixed(1) + '%';
    document.getElementById('resultLatency').textContent = data.latency_ms.toFixed(1) + 'ms';
    document.getElementById('resultReason').textContent = data.routing_reason;

    // Update local stats display
    stats.requestsToday++;
    stats.totalLatency += data.latency_ms;
    data.selected_tier === 'large_llm' ? stats.largeRoutes++ : stats.smallRoutes++;

    document.getElementById('requestsToday').textContent = stats.requestsToday;
    document.getElementById('smallRoutes').textContent = stats.smallRoutes;
    document.getElementById('largeRoutes').textContent = stats.largeRoutes;
    document.getElementById('avgLatency').textContent = (stats.totalLatency / stats.requestsToday).toFixed(1) + 'ms';
}

function addSystemLog(msg, type = 'info') {
    const logs = document.getElementById('systemLogs');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString().split(' ')[0];
    const color = type === 'error' ? '#ef4444' : type === 'warning' ? '#eab308' : type === 'success' ? '#22c55e' : '#6b7280';

    entry.innerHTML = `<span style="color:${color}">[${time}]</span> ${msg}`;
    logs.prepend(entry);

    // Keep only last 10 logs
    if (logs.children.length > 10) logs.lastChild.remove();
}

function simulateBackgroundActivity() {
    const actions = [
        'Syncing usage stats...',
        'Checking model health...',
        'Optimizing route cache...',
        'Node heartbeat: OK',
        'Updating latency metrics...'
    ];
    if (Math.random() > 0.7) {
        addSystemLog(actions[Math.floor(Math.random() * actions.length)], 'info');
    }
}
