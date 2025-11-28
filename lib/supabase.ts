import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bszkdudadsxuuhzdoztn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzemtkdWRhZHN4dXVoemRvenRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NzY3MjYsImV4cCI6MjA3NzQ1MjcyNn0.wElaxXKnKwMMRqu_-mHvGIsKWUK4RcKUbqCvSPTI0dk";

export const supabase = createClient(supabaseUrl, supabaseKey);