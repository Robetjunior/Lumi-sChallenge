// supabase.ts

import { createClient } from '@supabase/supabase-js';

// Substitua pela URL do seu projeto Supabase e a chave pública
const supabaseUrl = 'https://yhivluwnxpbqwntxnmtn.supabase.co'; // Encontre a URL no painel do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaXZsdXdueHBicXdudHhubXRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTE2OTY2OSwiZXhwIjoyMDQ0NzQ1NjY5fQ.BfXq0U1LWUlSdQdVBq1Qd8N4lyU2IWVnvCCSLEjfBjw'; // Encontre no painel do Supabase, normalmente chamada de anon key

// Inicializa o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
