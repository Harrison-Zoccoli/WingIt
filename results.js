document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    updateNavbar(user);
    
    document.getElementById('result-user').textContent = urlParams.get('userName') || user.fullName;
    document.getElementById('result-pickup').textContent = urlParams.get('pickup') || 'Not specified';
    document.getElementById('result-airport').textContent = urlParams.get('airport') || 'Not specified';
    document.getElementById('result-date').textContent = urlParams.get('date') || 'Not specified';
    document.getElementById('result-time').textContent = urlParams.get('time') || 'Not specified';
});

function updateNavbar(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (user) {
        const firstName = user.fullName.split(' ')[0];
        authButtons.innerHTML = `
            <span class="user-name">${firstName}</span>
            <a href="#" class="logout-btn" onclick="logout()">Logout</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
} 