import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://atvtfhsozmrogcxvnecp.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dnRmaHNvem1yb2djeHZuZWNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxMzg5MywiZXhwIjoyMDU5MDg5ODkzfQ.YgoNWKH_Y9wZxt_33lrry2W3apkxtewQMkG8aQ-IH3c';

export const supabase = createClient(supabaseUrl, supabaseKey);
