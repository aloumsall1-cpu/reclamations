// Supabase Client Initialization
const SUPABASE_URL = 'https://rijihuzzuxeeyqnnxore.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpamlodXp6dXhlZXlxbm54b3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTkyMzcsImV4cCI6MjA3OTkzNTIzN30.mYz9pX5qZ8vW3kL2nM1oP4qR5sT6uV7wX8yZ9aB0cD1'

let supabaseClient = null;

// Utiliser fetch pour créer le client
async function initializeSupabase() {
    try {
        // Charger Supabase depuis CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.43.5';
        script.onload = () => {
            if (window.supabase) {
                const { createClient } = window.supabase;
                supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase initialized');
                // Trigger event pour app.js
                window.dispatchEvent(new Event('supabaseReady'));
            }
        };
        script.onerror = () => {
            console.error('❌ Failed to load Supabase');
            window.dispatchEvent(new Event('supabaseFailed'));
        };
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
    initializeSupabase();
}

// Fonction de vérification
function getSupabaseClient() {
    return supabaseClient;
}

function isSupabaseReady() {
    return supabaseClient !== null;
}
