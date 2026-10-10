import { renderDashboard } from './dashboard.js';
import { renderEstoque, initEstoqueListeners } from './estoque.js';
import { renderMovimentos, initMovimentosListeners } from './movimentos.js';
import { renderCrm, initCrmListeners } from './crm.js';

window.switchTab = function(tab) {
    ['dashboard', 'estoque', 'movimentos', 'crm'].forEach(t => {
        const sec = document.getElementById(`section-${t}`);
        const btn = document.getElementById(`tab-${t}`);
        if (sec) sec.classList.add('hidden');
        if (btn) btn.className = "px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white transition";
    });
    
    const targetSec = document.getElementById(`section-${tab}`);
    const targetBtn = document.getElementById(`tab-${tab}`);
    if (targetSec) targetSec.classList.remove('hidden');
    if (targetBtn) targetBtn.className = "px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white transition";

    if (tab === 'dashboard') {
        renderDashboard();
    }
};

window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.openMovModal = function(prodId, type) {
    document.getElementById('movProdId').value = prodId;
    document.getElementById('movType').value = type;
    document.getElementById('movModalTitle').innerText = `${type} de Estoque`;
    document.getElementById('movQtd').value = '';
    document.getElementById('movObs').value = '';
    window.openModal('modalMov');
};

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderEstoque();
    renderMovimentos();
    renderCrm();

    // Sincroniza as atualizações entre os módulos e o dashboard
    const refreshAll = () => {
        renderDashboard();
        renderMovimentos();
    };

    initEstoqueListeners(refreshAll);
    initMovimentosListeners(() => { renderEstoque(); renderDashboard(); });
    initCrmListeners(renderDashboard);
});
