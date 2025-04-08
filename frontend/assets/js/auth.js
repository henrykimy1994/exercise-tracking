/**
 * Authentication JavaScript
 * Handles user login and registration functionality
 */

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get form elements if they exist on the current page
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Attach event handlers to forms if they exist
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');

    // If token exists and we're on an auth page, redirect to dashboard
    if (token && (window.location.href.includes('login.html') || window.location.href.includes('signup.html'))) {
        window.location.href = '/frontend/index.html'
    }

    // Check if we've just registered (URL parameter)
    if (window.location.href.includes('login.html?registered=true')) {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = 'Registration successful! You can now log in.';
            errorElement.style.color = 'var(--secondary-color)';
        }
    }
});

/**
 * Handles the login form submission
 * @param {Event} e - The form submission event 
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    try {
        errorElement.textContent = '';

        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })

        const data = await response.json();

        // Handle error response
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.userId);
        localStorage.setItem('user_name', data.name);

        // Redirect to dashboard
        window.location.href = '/frontend/index.html'
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Login error:', error);
    }
}

/**
 * Handles the signup form submission
 * @param {Event} e - The form submission event 
 */
async function handleSignup(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('signup-error');

    // Clear previous errors
    errorElement.textContent = '';

    // Valudate password match
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        return;
    }

    try {
        // Send registration request to API
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        window.location.href = '/frontend/login.html?registered=true';
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Signup error:', error);
    }
}