import { supabase } from './supabase.js';

export let produtos = [];
export let movimentos = [];
export let clientes = [];

// Função para carregar todos os dados da nuvem ao iniciar o app
export async function loadDatabase() {
    try {
        const [resProd, resMov, resCli] = await Promise.all([
            supabase.from('produtos').select('*').order('id', { ascending: true }),
            supabase.from('movimentos').select('*').order('id', { ascending: false }),
            supabase.from('clientes').select('*').order('id', { ascending: true })
        ]);

        if (resProd.error) throw resProd.error;
        if (resMov.error) throw resMov.error;
        if (resCli.error) throw resCli.error;

        produtos = resProd.data || [];
        movimentos = resMov.data || [];
        clientes = resCli.data || [];

        return true;
    } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
        return false;
    }
}
