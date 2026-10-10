import { produtos, clientes } from './state.js';

export function renderDashboard() {
    const elTotalValue = document.getElementById('dashTotalValue');
    const elTotalProducts = document.getElementById('dashTotalProducts');
    const elCriticalStock = document.getElementById('dashCriticalStock');
    const elTotalClients = document.getElementById('dashTotalClients');

    if (!elTotalValue) return;

    let totalValue = 0;
    let criticalCount = 0;

    produtos.forEach(p => {
        totalValue += (Number(p.price) * Number(p.stock));
        if (Number(p.stock) <= 3) {
            criticalCount++;
        }
    });

    elTotalValue.innerText = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    elTotalProducts.innerText = produtos.length;
    elCriticalStock.innerText = criticalCount;
    elTotalClients.innerText = clientes.length;
}
