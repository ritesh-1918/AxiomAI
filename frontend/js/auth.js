// AxiomAI Authentication Module

// Show message
function showMessage(text, type = 'error') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.innerHTML = `<div class="message ${type}">${text}</div>`;
        setTimeout(() => {
            messageEl.innerHTML = '';
        }, 5000);
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    if (!email || !password) {
        showMessage('Please enter email and password');
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner"></span> Signing in...';

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Success - redirect to dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message || 'Authentication failed');
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Sign In';
    }
}

// Handle Signup
async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Please enter email and password first');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters');
        return;
    }

    try {
        showMessage('Creating account...', 'success');

        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: email.split('@')[0]
                }
            }
        });

        if (error) throw error;

        if (data.user && !data.session) {
            showMessage('Account created! Check your email for verification.', 'success');
        } else if (data.session) {
            showMessage('Account created! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }

    } catch (error) {
        console.error('Signup error:', error);
        showMessage(error.message || 'Signup failed');
    }
}

// Handle OAuth
async function handleOAuth(provider) {
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });

        if (error) throw error;

    } catch (error) {
        console.error('OAuth error:', error);
        showMessage(`${provider} login failed: ${error.message}`);
    }
}

// Check authentication status
async function checkAuth() {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();

        if (!session) {
            // If on dashboard without session, redirect to login
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
            return null;
        }

        return session.user;

    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

// Logout
async function logout() {
    try {
        await window.supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Listen for auth state changes
if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'login.html';
        } else if (event === 'SIGNED_IN' && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    });
}
