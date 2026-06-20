const { createClient } = require('@supabase/supabase-js');

// Service key gives server-side access to storage without RLS restrictions
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
