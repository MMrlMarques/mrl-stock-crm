import { supabase } from './supabase.js';

export let produtos = [];
export let movimentos = [];
export let clientes = [];

// Dados padrão (Seed) caso o banco esteja vazio
const defaultProdutos = [
    { name: "Teclado Mecânico RGB", category: "Periféricos", price: 299.00, stock: 15 },
    { name: "Mouse Gamer 16000DPI", category: "Periféricos", price: 150.00, stock: 8 }
];

const defaultMovimentos = [
    { date: "10/10/2026 10:00", type: "Entrada Inicial", prod_name: "Teclado Mecânico RGB", qtd: 15, obs: "Cadastro do produto" }
];

const defaultClientes = [
    { name: "Carlos Silva", phone: "12991421077", stage: "Negociação" }
];

export async function loadDatabase() {
    try {
        const [resProd, resMov, resCli] = await Promise.all([
            supabase.from('produtos').select('*').order('id', { ascending: true }),
            supabase.from('movimentos').select('*').order('id', { ascending: false }),
            supabase.from('clientes').select('*').order('id', { ascending: true })
        ]);

        produtos = resProd.data || [];
        movimentos = resMov.data || [];
        clientes = resCli.data || [];

        // Se a tabela de produtos estiver vazia, insere os exemplos automaticamente no Supabase
        if (produtos.length === 0) {
            const { data: insertedProd } = await supabase.from('produtos').insert(defaultProdutos).select();
            if (insertedProd) produtos = insertedProd;
        }

        // Se a tabela de movimentos estiver vazia, insere o exemplo
        if (movimentos.length === 0) {
            const { data: insertedMov } = await supabase.from('movimentos').insert(defaultMovimentos).select();
            if (insertedMov) movimentos = insertedMov;
        }

        // Se a tabela de clientes estiver vazia, insere o exemplo
        if (clientes.length === 0) {
            const { data: insertedCli } = await supabase.from('clientes').insert(defaultClientes).select();
            if (insertedCli) clientes = insertedCli;
        }

        return true;
    } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
        return false;
    }
}
