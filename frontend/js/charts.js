function initCharts() {
    // Label Distribution
    new Chart(document.getElementById('labelDistChart'), {
        type: 'doughnut',
        data: { labels: ['Small LLM (0)', 'Large LLM (1)'], datasets: [{ data: [6370, 8936], backgroundColor: ['#10b981', '#f43f5e'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
    // Text Length
    new Chart(document.getElementById('textLengthChart'), {
        type: 'bar',
        data: { labels: ['0-25', '26-50', '51-75', '76-100', '100+'], datasets: [{ label: 'Count', data: [1200, 3500, 4800, 3200, 2606], backgroundColor: '#6366f1' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
    // Complexity
    new Chart(document.getElementById('complexityChart'), {
        type: 'radar',
        data: { labels: ['Code Keywords', 'Math Terms', 'Question Words', 'Technical Jargon', 'Length Score'], datasets: [{ label: 'Small LLM', data: [20, 15, 80, 25, 30], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16,185,129,0.2)' }, { label: 'Large LLM', data: [85, 70, 60, 80, 75], borderColor: '#f43f5e', fill: true, backgroundColor: 'rgba(244,63,94,0.2)' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
    // Performance
    new Chart(document.getElementById('performanceChart'), {
        type: 'bar',
        data: { labels: ['Accuracy', 'F1', 'Precision', 'Recall'], datasets: [{ label: 'Score', data: [0.978, 0.96, 0.97, 0.96], backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'] }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0.9, max: 1 } } }
    });
    // Training
    new Chart(document.getElementById('trainingChart'), {
        type: 'line',
        data: { labels: ['Step 100', '200', '300', '400', '500', '600', '700', '800'], datasets: [{ label: 'Loss', data: [0.69, 0.45, 0.28, 0.15, 0.08, 0.04, 0.02, 0.01], borderColor: '#f43f5e', tension: 0.3 }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
    // CV
    new Chart(document.getElementById('cvChart'), {
        type: 'bar',
        data: { labels: ['Fold 1', 'Fold 2', 'Fold 3', 'Fold 4', 'Fold 5'], datasets: [{ label: 'Accuracy', data: [0.975, 0.981, 0.972, 0.979, 0.977], backgroundColor: '#6366f1' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0.95, max: 1 } } }
    });
}
