import { supabase } from './supabase.js';

export let produtos = [
    { name: "Teclado Mecânico RGB", category: "Periféricos", price: 299.00, stock: 15 },
    { name: "Mouse Gamer 16000DPI", category: "Periféricos", price: 150.00, stock: 8 }
];

export let movimentos = [
    { date: "10/10/2026 10:00", type: "Entrada Inicial", prod_name: "Teclado Mecânico RGB", qtd: 15, obs: "Cadastro do produto" }
];

export let clientes = [
    { name: "Carlos Silva", phone: "12991421077", stage: "Negociação" }
];

export async function loadDatabase() {
    try {
        const resProd = await supabase.from('produtos').select('*').order('id', { ascending: true });
        if (resProd.data && resProd.data.length > 0) {
            produtos.length = 0;
            produtos.push(...resProd.data);
        }

        const resMov = await supabase.from('movimentos').select('*').order('id', { ascending: false });
        if (resMov.data && resMov.data.length > 0) {
            movimentos.length = 0;
            movimentos.push(...resMov.data);
        }

        const resCli = await supabase.from('clientes').select('*').order('id', { ascending: true });
        if (resCli.data && resCli.data.length > 0) {
            clientes.length = 0;
            clientes.push(...resCli.data);
        }

        return true;
    } catch (err) {
        console.error("Erro ao carregar do Supabase:", err);
        return false;
    }
}
