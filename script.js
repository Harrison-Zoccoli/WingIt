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
        rideForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!checkLoginStatus()) {
                alert('Please log in to book a ride');
                window.location.href = 'login.html';
                return;
            }

            const user = JSON.parse(localStorage.getItem('currentUser'));
            const formData = {
                userId: user.id,
                pickup: document.getElementById('pickup').value,
                airport: document.getElementById('airport').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value
            };
            
            console.log('Sending ride request:', formData);
            
            try {
                const response = await fetch('/api/rides', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('Ride request response:', response);
                
                if (!response.ok) {
                    throw new Error('Failed to create ride request');
                }
                
                const result = await response.json();
                window.location.href = `results.html?${new URLSearchParams(formData).toString()}`;
            } catch (error) {
                alert('Error creating ride request: ' + error.message);
            }
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
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const credentials = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }
                
                const user = await response.json();
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } catch (error) {
                alert('Invalid email or password');
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                fullName: document.getElementById('fullName').value,
                college: document.getElementById('college').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            console.log('Sending signup data:', userData);
            
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                
                console.log('Signup response:', response);
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }
                
                const user = await response.json();
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } catch (error) {
                alert('Error creating account: ' + error.message);
            }
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

// Replace localStorage operations with API calls
async function signup(userData) {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    
    const user = await response.json();
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
}

async function login(credentials) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    
    const user = await response.json();
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
} 