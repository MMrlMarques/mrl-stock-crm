import { produtos, movimentos, clientes } from './state.js';

let myChart = null;

export function renderDashboard() {
    const totalEstoque = produtos.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0);
    const totalProdutos = produtos.reduce((acc, p) => acc + Number(p.stock), 0);
    const produtosCriticos = produtos.filter(p => Number(p.stock) <= 3).length;
    const totalCrm = clientes.length;

    // Atualiza os cards de métricas utilizando os IDs exatos do index.html
    const cardValor = document.getElementById('dashTotalValue');
    const cardProd = document.getElementById('dashTotalProducts');
    const cardCrit = document.getElementById('dashCriticalStock');
    const cardCrm = document.getElementById('dashTotalClients');

    if (cardValor) cardValor.innerText = `R$ ${totalEstoque.toFixed(2)}`;
    if (cardProd) cardProd.innerText = totalProdutos;
    if (cardCrit) cardCrit.innerText = produtosCriticos;
    if (cardCrm) cardCrm.innerText = totalCrm;

    // Renderiza o Gráfico de Stock por Categoria
    renderChart();
}

function renderChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;

    // Agrupa o stock por categoria
    const categories = {};
    produtos.forEach(p => {
        const cat = p.category || 'Geral';
        categories[cat] = (categories[cat] || 0) + Number(p.stock);
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['Sem produtos'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 11, family: 'sans-serif' },
                        boxWidth: 12
                    }
                }
            }
        }
    });
}
