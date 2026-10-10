import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://doxzbpjczenukympjltu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveHpicGpjemVudWt5bXBqbHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NDIyMDEsImV4cCI6MjEwNzIxODIwMX0.KVxTbUi7QKBJG0HaHoqc_wjvqiSL2WXXA6ar39nJ_v4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
