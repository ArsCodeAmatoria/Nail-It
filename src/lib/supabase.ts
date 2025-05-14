import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  // Use empty strings as placeholders, the app will show appropriate errors
  supabaseUrl = 'https://placeholder-url.supabase.co'
  supabaseAnonKey = 'placeholder-key'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 