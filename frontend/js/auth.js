// Supabase Auth Integration

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = event.target.querySelector('button');
    const originalText = submitBtn.innerText;

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Signing in...';

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Login successful
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Authentication failed: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
    }
}

async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return alert('Please enter email and password first');
    }

    try {
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

        alert('Account created! You can now sign in.');
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
}

async function checkAuth() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (!session) {
        // If we are on dashboard, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }

    return session.user;
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'login.html';
}

// Check auth state change
if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'login.html';
        }
    });
}
