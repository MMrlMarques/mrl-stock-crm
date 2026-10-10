import { movimentos, produtos } from './state.js';
import { supabase } from './supabase.js';
import { showToast } from './toast.js';

export function renderMovimentos() {
    const tbody = document.getElementById('movimentosTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (movimentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhuma movimentação registrada.</td></tr>`;
        return;
    }

    movimentos.forEach(m => {
        const badgeColor = m.type.includes('Entrada') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/50 transition-colors">
                <td class="p-4 text-slate-400 text-xs">${m.date}</td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${badgeColor}">${m.type}</span></td>
                <td class="p-4 font-medium text-white">${m.prod_name}</td>
                <td class="p-4 font-bold text-slate-200">${m.qtd}</td>
                <td class="p-4 text-slate-400 text-xs">${m.obs}</td>
            </tr>
        `;
    });
}

export function initMovimentosListeners(updateCallbacks) {
    const form = document.getElementById('formMov');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prodId = parseInt(document.getElementById('movProdId').value);
            const type = document.getElementById('movType').value;
            const qtd = parseInt(document.getElementById('movQtd').value);
            const obs = document.getElementById('movObs').value || 'Sem observação';

            const prod = produtos.find(p => p.id === prodId);
            if (!prod) return;

            if (type === 'Saída' && prod.stock < qtd) {
                showToast('Erro: Estoque insuficiente para esta saída!', 'error');
                return;
            }

            const novoEstoque = type === 'Entrada' ? prod.stock + qtd : prod.stock - qtd;

            // Atualiza o estoque do produto no Supabase
            const { error: errUp } = await supabase
                .from('produtos')
                .update({ stock: novoEstoque })
                .eq('id', prod.id);

            if (errUp) {
                showToast('Erro ao atualizar estoque na nuvem.', 'error');
                return;
            }

            prod.stock = novoEstoque;

            // Insere a movimentação no Supabase
            const movPayload = {
                date: new Date().toLocaleString('pt-BR'),
                type: type,
                prod_name: prod.name,
                qtd: qtd,
                obs: obs
            };

            const { data: newMov, error: errMov } = await supabase
                .from('movimentos')
                .insert([movPayload])
                .select();

            if (!errMov && newMov) movimentos.unshift(newMov[0]);

            window.closeModal('modalMov');
            renderMovimentos();
            showToast(`Movimentação de ${type} salva na nuvem!`, 'success');
            if (updateCallbacks) updateCallbacks();
        });
    }

    const btnClear = document.getElementById('btnClearMov');
    if (btnClear) {
        btnClear.addEventListener('click', async () => {
            if (confirm("Deseja apagar todo o histórico do banco de dados?")) {
                await supabase.from('movimentos').delete().neq('id', 0); // Deleta todos
                movimentos.length = 0;
                renderMovimentos();
                showToast('Histórico limpo na nuvem.', 'info');
                if (updateCallbacks) updateCallbacks();
            }
        });
    }

    const btnExport = document.getElementById('btnExportPdf');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            exportToPDF();
            showToast('Relatório em PDF gerado!', 'success');
        });
    }
}
