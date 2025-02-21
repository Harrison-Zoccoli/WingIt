function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        return user;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    const rideForm = document.getElementById('rideForm');
    const user = checkLoginStatus();

    updateNavbar(user);
    
    if (rideForm) {
        rideForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkLoginStatus()) {
                alert('Please log in to book a ride');
                window.location.href = 'login.html';
                return;
            }

            const pickup = document.getElementById('pickup');
            const airport = document.getElementById('airport');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            
            let isValid = true;
            const errors = [];
            
            if (!pickup.value.trim()) {
                isValid = false;
                pickup.classList.add('error');
                errors.push('Please enter a pickup location');
            } else {
                pickup.classList.remove('error');
            }
            
            if (!airport.value.trim()) {
                isValid = false;
                airport.classList.add('error');
                errors.push('Please enter an airport');
            } else {
                airport.classList.remove('error');
            }
            
            if (!date.value) {
                isValid = false;
                date.classList.add('error');
                errors.push('Please select a date');
            } else {
                date.classList.remove('error');
            }
            
            if (!time.value) {
                isValid = false;
                time.classList.add('error');
                errors.push('Please select a time');
            } else {
                time.classList.remove('error');
            }
            
            if (!isValid) {
                alert(errors.join('\n'));
                return;
            }
            
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const formData = {
                pickup: pickup.value,
                airport: airport.value,
                date: date.value,
                time: time.value,
                userName: user.fullName
            };
            
            console.log('Form Data Submitted:', formData);
            
            const searchParams = new URLSearchParams(formData);
            window.location.href = `results.html?${searchParams.toString()}`;
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newUser = {
                fullName: document.getElementById('fullName').value,
                college: document.getElementById('college').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === newUser.email)) {
                alert('Email already registered');
                return;
            }
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'index.html';
        });
    }
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