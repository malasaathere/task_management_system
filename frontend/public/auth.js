/**
 * TaskMaster Pro - Authentication Script
 * Handles login form validation, password visibility toggle, error displays, and mock API integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const authAlert = document.getElementById('auth-alert');
    const submitBtn = document.getElementById('submit-btn');
    
    // Toggle Password Visibility
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle SVG icons
            const eyeIcon = passwordToggle.querySelector('.eye-icon');
            const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');
            
            if (isPassword) {
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
                passwordToggle.setAttribute('aria-label', 'Hide password');
            } else {
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
                passwordToggle.setAttribute('aria-label', 'Show password');
            }
        });
    }

    // Input validation on typing (clear error when user modifies input)
    if (emailInput && emailError) {
        emailInput.addEventListener('input', () => {
            clearError(emailInput, emailError);
        });
    }

    if (passwordInput && passwordError) {
        passwordInput.addEventListener('input', () => {
            clearError(passwordInput, passwordError);
        });
    }

    // Form Submit Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous states
            resetErrors();
            hideAlert();

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Client-side Validation
            let isValid = true;

            // Email validation
            if (!email) {
                showError(emailInput, emailError, 'Email address is required');
                isValid = false;
            } else if (!validateEmailFormat(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }

            // Password validation
            if (!password) {
                showError(passwordInput, passwordError, 'Password is required');
                isValid = false;
            }

            // If validation passes, attempt login
            if (isValid) {
                await login(email, password, rememberMe);
            }
        });
    }

    /**
     * Authenticates the user with credentials
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe 
     */
    async function login(email, password, rememberMe) {
        // Set loading state
        setLoading(true);

        try {
            // Simulate network latency (1.5 seconds) to demonstrate premium spinner loading state
            await new Promise(resolve => setTimeout(resolve, 1500));

            // =======================================================
            // FRONTEND PREPARATION FOR BACKEND INTEGRATION
            // =======================================================
            // TODO: Replace with API call:
            // POST /api/auth/login
            //
            // Example Integration Code:
            // /*
            // try {
            //     const response = await fetch('https://your-api-domain.com/api/auth/login', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Accept': 'application/json'
            //         },
            //         body: JSON.stringify({ email, password })
            //     });
            //
            //     const result = await response.json();
            //
            //     if (response.ok) {
            //         // Save token and login data
            //         if (rememberMe) {
            //             localStorage.setItem('token', result.token);
            //             localStorage.setItem('user', JSON.stringify(result.user));
            //         } else {
            //             sessionStorage.setItem('token', result.token);
            //             sessionStorage.setItem('user', JSON.stringify(result.user));
            //         }
            //         
            //         showAlert('success', 'Login successful! Redirecting...');
            //         setTimeout(() => {
            //             window.location.href = 'admin-dashboard.html';
            //         }, 1000);
            //     } else {
            //         showAlert('error', result.message || 'Invalid email or password.');
            //         setLoading(false);
            //     }
            // } catch (error) {
            //     showAlert('error', 'Unable to connect to the server. Please check your connection.');
            //     setLoading(false);
            // }
            // */
            // =======================================================

            // Mock Implementation (For testing & verification)
            // Just simulate a successful login for any input that passes client-side validation
            showAlert('success', 'Login successful! Redirecting to dashboard...');
            
            // Optional: Store mock session
            if (rememberMe) {
                localStorage.setItem('taskmaster_logged_in', 'true');
                localStorage.setItem('taskmaster_user_email', email);
            } else {
                sessionStorage.setItem('taskmaster_logged_in', 'true');
                sessionStorage.setItem('taskmaster_user_email', email);
            }

            // Smart Routing based on email address
            let redirectUrl = 'collaborator-dashboard.html';
            const emailLower = email.toLowerCase();
            if (emailLower.includes('admin')) {
                redirectUrl = 'admin-dashboard.html';
            } else if (emailLower.includes('manager') || emailLower.includes('alex')) {
                redirectUrl = 'manager-dashboard.html';
            }

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1200);

        } catch (error) {
            showAlert('error', 'An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    }

    // Helper functions
    function validateEmailFormat(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(inputElement, errorElement, message) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
    }

    function clearError(inputElement, errorElement) {
        if (!inputElement || !errorElement) return;
        if (inputElement.classList.contains('input-error')) {
            inputElement.classList.remove('input-error');
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-4px)';
            setTimeout(() => {
                if (errorElement.style.opacity === '0') {
                    errorElement.textContent = '';
                }
            }, 150);
        }
    }

    function resetErrors() {
        const inputs = [emailInput, passwordInput];
        const errors = [emailError, passwordError];

        inputs.forEach(input => {
            if (input) input.classList.remove('input-error');
        });
        errors.forEach(err => {
            if (err) {
                err.style.opacity = '0';
                err.style.transform = 'translateY(-4px)';
                err.textContent = '';
            }
        });
    }

    function showAlert(type, message) {
        if (!authAlert) return;
        authAlert.className = `alert alert-${type}`;
        
        // Add matching SVG icon to alert for rich visuals
        let iconSvg = '';
        if (type === 'error') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
        } else if (type === 'success') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        }
        
        authAlert.innerHTML = `${iconSvg} <span>${message}</span>`;
        authAlert.classList.remove('hidden');
    }

    function hideAlert() {
        if (!authAlert) return;
        authAlert.classList.add('hidden');
        authAlert.innerHTML = '';
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            if (emailInput) emailInput.disabled = true;
            if (passwordInput) passwordInput.disabled = true;
            if (passwordToggle) passwordToggle.disabled = true;
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            if (emailInput) emailInput.disabled = false;
            if (passwordInput) passwordInput.disabled = false;
            if (passwordToggle) passwordToggle.disabled = false;
        }
    }
});
