const defaultProdutos = [
    { id: 1, name: "Teclado Mecânico RGB", category: "Periféricos", price: 299.00, stock: 15 },
    { id: 2, name: "Mouse Gamer 16000DPI", category: "Periféricos", price: 150.00, stock: 8 }
];

const defaultMovimentos = [
    { date: "10/10/2026 10:00", type: "Entrada Inicial", prodName: "Teclado Mecânico RGB", qtd: 15, obs: "Cadastro do produto" }
];

const defaultClientes = [
    { id: 1, name: "Carlos Silva", phone: "12991421077", stage: "Negociação" }
];

// Correção: Garante que se o localStorage estiver vazio ou com array vazio, puxa os defaults
const storedProdutos = JSON.parse(localStorage.getItem('mrl_produtos'));
const storedMovimentos = JSON.parse(localStorage.getItem('mrl_movimentos'));
const storedClientes = JSON.parse(localStorage.getItem('mrl_clientes'));

export let produtos = (storedProdutos && storedProdutos.length > 0) ? storedProdutos : defaultProdutos;
export let movimentos = (storedMovimentos && storedMovimentos.length > 0) ? storedMovimentos : defaultMovimentos;
export let clientes = (storedClientes && storedClientes.length > 0) ? storedClientes : defaultClientes;

export function saveStorage() {
    localStorage.setItem('mrl_produtos', JSON.stringify(produtos));
    localStorage.setItem('mrl_movimentos', JSON.stringify(movimentos));
    localStorage.setItem('mrl_clientes', JSON.stringify(clientes));
}
