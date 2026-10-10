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

export let produtos = JSON.parse(localStorage.getItem('mrl_produtos')) || defaultProdutos;
export let movimentos = JSON.parse(localStorage.getItem('mrl_movimentos')) || defaultMovimentos;
export let clientes = JSON.parse(localStorage.getItem('mrl_clientes')) || defaultClientes;

export function saveStorage() {
    localStorage.setItem('mrl_produtos', JSON.stringify(produtos));
    localStorage.setItem('mrl_movimentos', JSON.stringify(movimentos));
    localStorage.setItem('mrl_clientes', JSON.stringify(clientes));
}
