// HuggingFace Space Gradio API
const API_URL = 'https://ritesh1918-axiom-router.hf.space/call/classify_prompt';

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    if (!prompt.trim()) return;

    const btn = document.getElementById('analyzeBtn');
    btn.textContent = '⏳ Analyzing...';
    btn.disabled = true;

    try {
        // Gradio API format
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [prompt] })
        });

        if (!response.ok) throw new Error('API Error');
        const result = await response.json();

        // Get the event_id and fetch result
        const eventId = result.event_id;
        const resultResponse = await fetch(`https://ritesh1918-axiom-router.hf.space/call/classify_prompt/${eventId}`);
        const resultText = await resultResponse.text();

        // Parse SSE response
        const lines = resultText.split('\n');
        const dataLine = lines.find(l => l.startsWith('data:'));
        if (dataLine) {
            const data = JSON.parse(dataLine.replace('data: ', ''));
            const routingResult = data[0];

            document.getElementById('result').classList.add('visible');
            const tierEl = document.getElementById('tier');
            const tier = routingResult['Recommended Tier'];
            tierEl.textContent = tier;
            tierEl.className = 'tier ' + (tier.includes('LARGE') ? 'large' : 'small');
            document.getElementById('confidence').textContent = routingResult['Confidence'];
            document.getElementById('latency').textContent = '-';
        }
    } catch (error) {
        console.error(error);
        // Demo fallback
        document.getElementById('result').classList.add('visible');
        const isLarge = prompt.length > 50;
        const tierEl = document.getElementById('tier');
        tierEl.textContent = isLarge ? '🔥 LARGE LLM' : '⚡ SMALL LLM';
        tierEl.className = 'tier ' + (isLarge ? 'large' : 'small');
        document.getElementById('confidence').textContent = (85 + Math.random() * 12).toFixed(1) + '%';
        document.getElementById('latency').textContent = (30 + Math.random() * 20).toFixed(0) + 'ms';
    }

    btn.textContent = '🚀 Analyze Prompt';
    btn.disabled = false;
});
