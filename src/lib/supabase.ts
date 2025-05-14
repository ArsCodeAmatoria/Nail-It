import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Fallback hardcoded credentials (only use in development as a fallback)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using fallback credentials')
  supabaseUrl = 'https://hvsvmxrktlmtywxwbwdd.supabase.co'
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2c3ZteHJrdGxtdHl3eHdid2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODc1ODIsImV4cCI6MjA2MjY2MzU4Mn0.9nwvTupvFoTJVWWtoXtNnQ-vj73vy1dx91uLjzChJ98'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 