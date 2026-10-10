import { clientes, saveStorage } from './state.js';

export function renderCrm() {
    const query = document.getElementById('searchCrm').value.toLowerCase();
    const grid = document.getElementById('crmGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = clientes.filter(c => c.name.toLowerCase().includes(query) || c.stage.toLowerCase().includes(query));

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-slate-400 text-center col-span-3 py-8">Nenhum cliente cadastrado.</p>`;
        return;
    }

    filtered.forEach(c => {
        const stageColor = c.stage === 'Fechado' ? 'bg-emerald-100 text-emerald-800' : (c.stage === 'Negociação' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800');
        grid.innerHTML += `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-slate-800 text-base">${c.name}</h3>
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium ${stageColor}">${c.stage}</span>
                    </div>
                    <p class="text-slate-500 text-sm mb-4">📱 WhatsApp: ${c.phone}</p>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                    <a href="https://wa.me/55${c.phone}?text=Olá%20${encodeURIComponent(c.name)},%20tudo%20bem?" target="_blank" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-medium transition">
                        💬 Chamar no WhatsApp
                    </a>
                    <button data-del-client="${c.id}" class="text-xs text-rose-600 hover:underline">Excluir</button>
                </div>
            </div>
        `;
    });
}

export function initCrmListeners(updateCallbacks) {
    const form = document.getElementById('formCliente');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cliName').value;
            const phone = document.getElementById('cliPhone').value;
            const stage = document.getElementById('cliStage').value;

            const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
            clientes.push({ id: newId, name, phone, stage });

            saveStorage();
            window.closeModal('modalCliente');
            form.reset();
            renderCrm();
            if (updateCallbacks) updateCallbacks();
        });
    }

    const grid = document.getElementById('crmGrid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            const btnDel = e.target.closest('[data-del-client]');
            if (btnDel) {
                const id = parseInt(btnDel.dataset.delClient);
                if (confirm("Deseja excluir este cliente?")) {
                    const index = clientes.findIndex(c => c.id === id);
                    if (index !== -1) {
                        clientes.splice(index, 1);
                        saveStorage();
                        renderCrm();
                        if (updateCallbacks) updateCallbacks();
                    }
                }
            }
        });
    }

    const searchInput = document.getElementById('searchCrm');
    if (searchInput) {
        searchInput.addEventListener('input', renderCrm);
    }
}
