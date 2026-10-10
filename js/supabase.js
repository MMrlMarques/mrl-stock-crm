import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://doxzbpjczenukympjltu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Dar@IWtpyQeJPRxeuEJExw_sGUSkeNv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
