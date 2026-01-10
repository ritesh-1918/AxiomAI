
// Initialize Supabase Client
// CDN Link must be included in HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://dtslwolgtskxqtutschk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h0HiuuGzwqivU4NhjjGGhA_r7a0SmBo';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for other modules if needed, though usually window.supabase is used directly or this client is global
window.supabaseClient = supabase;
