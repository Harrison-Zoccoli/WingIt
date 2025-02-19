document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    document.getElementById('result-pickup').textContent = urlParams.get('pickup') || 'Not specified';
    document.getElementById('result-airport').textContent = urlParams.get('airport') || 'Not specified';
    document.getElementById('result-date').textContent = urlParams.get('date') || 'Not specified';
    document.getElementById('result-time').textContent = urlParams.get('time') || 'Not specified';
}); 