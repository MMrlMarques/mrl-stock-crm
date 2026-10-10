import { movimentos, produtos, saveStorage } from './state.js';

export function renderMovimentos() {
    const tbody = document.getElementById('movimentosTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (movimentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Nenhuma movimentação registrada.</td></tr>`;
        return;
    }

    movimentos.forEach(m => {
        const badgeColor = m.type.includes('Entrada') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
        tbody.innerHTML += `
            <tr class="border-b hover:bg-slate-50">
                <td class="p-3 text-slate-500 text-xs">${m.date}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded text-xs font-bold ${badgeColor}">${m.type}</span></td>
                <td class="p-3 font-medium text-slate-800">${m.prodName}</td>
                <td class="p-3 font-bold">${m.qtd}</td>
                <td class="p-3 text-slate-600 text-xs">${m.obs}</td>
            </tr>
        `;
    });
}

export function initMovimentosListeners(updateCallbacks) {
    const form = document.getElementById('formMov');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const prodId = parseInt(document.getElementById('movProdId').value);
            const type = document.getElementById('movType').value;
            const qtd = parseInt(document.getElementById('movQtd').value);
            const obs = document.getElementById('movObs').value || 'Sem observação';

            const prod = produtos.find(p => p.id === prodId);
            if (!prod) return;

            if (type === 'Saída' && prod.stock < qtd) {
                alert('Estoque insuficiente para esta saída!');
                return;
            }

            if (type === 'Entrada') prod.stock += qtd;
            else prod.stock -= qtd;

            movimentos.unshift({
                date: new Date().toLocaleString('pt-BR'),
                type: type,
                prodName: prod.name,
                qtd: qtd,
                obs: obs
            });

            saveStorage();
            window.closeModal('modalMov');
            renderMovimentos();
            if (updateCallbacks) updateCallbacks();
        });
    }

    const btnClear = document.getElementById('btnClearMov');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm("Deseja limpar todo o histórico de movimentações?")) {
                movimentos.length = 0;
                saveStorage();
                renderMovimentos();
                if (updateCallbacks) updateCallbacks();
            }
        });
    }
}
