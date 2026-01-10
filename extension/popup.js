// AxiomAI Extension Popup Logic

const STORAGE_KEY = 'axiom_settings';
const DEFAULT_SETTINGS = {
    enabled: true,
    mode: 'balanced'
};

// Elements
const toggle = document.getElementById('extensionToggle');
const modeSelect = document.getElementById('routingMode');
const applyBtn = document.getElementById('applyBtn');
const statusText = document.querySelector('.status-text');

// Load settings
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEY]);
        const settings = result[STORAGE_KEY] || DEFAULT_SETTINGS;

        toggle.checked = settings.enabled;
        modeSelect.value = settings.mode;
        updateStatus(settings.enabled);

    } catch (e) {
        console.error('Failed to load settings', e);
    }
});

// Save settings handler
applyBtn.addEventListener('click', async () => {
    const settings = {
        enabled: toggle.checked,
        mode: modeSelect.value
    };

    // UI Feedback
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Saving...';
    applyBtn.style.opacity = '0.7';

    try {
        await chrome.storage.local.set({ [STORAGE_KEY]: settings });

        // Notify content script
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'AXIOM_SETTINGS_UPDATED',
                settings: settings
            });
        }

        // Success state
        setTimeout(() => {
            applyBtn.textContent = 'Settings Saved!';
            applyBtn.style.background = '#10b981'; // Green
            applyBtn.style.opacity = '1';

            updateStatus(settings.enabled);

            setTimeout(() => {
                applyBtn.textContent = originalText;
                applyBtn.style.background = ''; // Reset to CSS gradient
            }, 1500);
        }, 500);

    } catch (e) {
        console.error('Failed to save', e);
        applyBtn.textContent = 'Error Saving';
    }
});

function updateStatus(enabled) {
    if (enabled) {
        statusText.textContent = `Active • ${getModeLabel(modeSelect.value)}`;
        statusText.style.color = '#059669'; // Greenish
    } else {
        statusText.textContent = 'Extension is inactive';
        statusText.style.color = '#94a3b8'; // Gray
    }
}

function getModeLabel(value) {
    const labels = {
        'cost_optimized': 'Cost Saving Mode',
        'balanced': 'Balanced Routing',
        'performance': 'Max Performance',
        'manual': 'Manual Approval'
    };
    return labels[value] || 'Ready';
}

// Toggle listener for immediate visual updates
toggle.addEventListener('change', () => {
    updateStatus(toggle.checked);
});

modeSelect.addEventListener('change', () => {
    updateStatus(toggle.checked);
});
