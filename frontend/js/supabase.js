// AxiomAI Supabase Client Configuration
// CDN: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2

const SUPABASE_URL = 'https://dtslwolgtskxqtutschk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0c2x3b2xndHNreHF0dXRzY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDU1MzEsImV4cCI6MjA4MzYyMTUzMX0.Zy5y6Czo8p9b7BqgpYRbCwJRJ6ILwaVL5LlDnVLvW2U';

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    // Check if Supabase SDK is loaded
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        // V2 SDK with createClient on window.supabase
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (typeof window.supabase !== 'undefined') {
        // Alternative: check window.supabase
        if (typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else if (typeof window.supabase === 'object' && window.supabase.auth) {
            // Already a client instance
            supabaseClient = window.supabase;
        }
    }

    if (supabaseClient) {
        window.supabaseClient = supabaseClient;
        console.log('✅ Supabase initialized successfully');
    } else {
        console.error('❌ Failed to initialize Supabase - SDK not loaded');
    }

    return supabaseClient;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (!window.supabaseClient) {
        initSupabase();
    }
});

// Try immediate initialization
initSupabase();

// Export globally
window.supabaseClient = supabaseClient;
window.initSupabase = initSupabase;
