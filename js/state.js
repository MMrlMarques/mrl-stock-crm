import { supabase } from './supabase.js';

export let produtos = [];
export let movimentos = [];
export let clientes = [];

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
        // Tenta buscar os dados um a um com timeout implícito para não travar
        const resProd = await supabase.from('produtos').select('*').order('id', { ascending: true });
        produtos = resProd.data && resProd.data.length > 0 ? resProd.data : defaultProdutos;

        const resMov = await supabase.from('movimentos').select('*').order('id', { ascending: false });
        movimentos = resMov.data && resMov.data.length > 0 ? resMov.data : defaultMovimentos;

        const resCli = await supabase.from('clientes').select('*').order('id', { ascending: true });
        clientes = resCli.data && resCli.data.length > 0 ? resCli.data : defaultClientes;

        return true;
    } catch (err) {
        console.error("Aviso ao carregar do Supabase, usando dados locais:", err);
        produtos = defaultProdutos;
        movimentos = defaultMovimentos;
        clientes = defaultClientes;
        return true;
    } finally {
        // Remove o loader obrigatoriamente, independentemente de qualquer erro
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('opacity-0');
            setTimeout(() => loader.remove(), 300);
        }
    }
}
