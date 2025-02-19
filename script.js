document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const rideForm = document.getElementById('rideForm');
    
    rideForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all form inputs
        const pickup = document.getElementById('pickup');
        const airport = document.getElementById('airport');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        // Check each field
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
        
        // If all fields are valid, create the form data
        const formData = {
            pickup: pickup.value,
            airport: airport.value,
            date: date.value,
            time: time.value
        };
        
        // Log to browser console
        console.log('Form Data Submitted:', formData);
        
        // Redirect to results page with search parameters
        const searchParams = new URLSearchParams(formData);
        window.location.href = `results.html?${searchParams.toString()}`;
    });

    // Smooth scrolling for navigation links
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

    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Here you would typically send this to your backend
            console.log('Login attempt:', { email, password });
            alert('Login functionality will be implemented soon!');
        });
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                fullName: document.getElementById('fullName').value,
                college: document.getElementById('college').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            // Here you would typically send this to your backend
            console.log('Signup attempt:', formData);
            alert('Signup functionality will be implemented soon!');
        });
    }
}); 