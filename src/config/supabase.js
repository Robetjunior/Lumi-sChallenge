"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://atvtfhsozmrogcxvnecp.supabase.co'; // Encontre a URL no painel do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaXZsdXdueHBicXdudHhubXRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTE2OTY2OSwiZXhwIjoyMDQ0NzQ1NjY5fQ.BfXq0U1LWUlSdQdVBq1Qd8N4lyU2IWVnvCCSLEjfBjw'; // Encontre no painel do Supabase, normalmente chamada de anon key
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
