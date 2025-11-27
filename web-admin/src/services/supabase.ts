import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjlhajphltqzfuhijgly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbGhhanBobHRxemZ1aGlqZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTI3NzYsImV4cCI6MjA3OTU2ODc3Nn0.9fDb6-bg_9hxlJrhPB37n129ncpRdWTPoTCQyRV8THk';

export const supabase = createClient(supabaseUrl, supabaseKey);
