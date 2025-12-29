
import { createClient } from '@supabase/supabase-js';

// Project: Ink Studio Tattoo
const supabaseUrl = 'https://uzbxnzokogdjslhzppmw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Ynhuem9rb2dkanNsaHpwcG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDE0MDcsImV4cCI6MjA4MjUxNzQwN30.5xEJdssgG73scDf9a_2PJ_ryVTGPkN7e1pSR3VLeTXw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
