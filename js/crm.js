import { clientes } from './state.js';
import { supabase } from './supabase.js';
import { showToast } from './toast.js';

export function renderCrm() {
    const query = document.getElementById('searchCrm').value.toLowerCase();
    const grid = document.getElementById('crmGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = clientes.filter(c => c.name.toLowerCase().includes(query) || c.stage.toLowerCase().includes(query));

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-slate-500 text-center col-span-3 py-12">Nenhum cliente cadastrado.</p>`;
        return;
    }

    filtered.forEach(c => {
        const stageColor = c.stage === 'Fechado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : (c.stage === 'Negociação' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-300 border-slate-700');
        grid.innerHTML += `
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-bold text-white text-base">${c.name}</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-medium border ${stageColor}">${c.stage}</span>
                    </div>
                    <p class="text-slate-400 text-xs mb-5 flex items-center gap-2">
                        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        WhatsApp: ${c.phone}
                    </p>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-slate-900">
                    <a href="https://wa.me/55${c.phone}?text=Olá%20${encodeURIComponent(c.name)},%20tudo%20bem?" target="_blank" class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Chamar
                    </a>
                    <button data-del-client="${c.id}" class="text-xs text-rose-500 hover:text-rose-400 transition-colors">Excluir</button>
                </div>
            </div>
        `;
    });
}

export function initCrmListeners(updateCallbacks) {
    const form = document.getElementById('formCliente');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('cliName').value;
            const phone = document.getElementById('cliPhone').value;
            const stage = document.getElementById('cliStage').value;

            const { data: newCli, error } = await supabase
                .from('clientes')
                .insert([{ name, phone, stage }])
                .select();

            if (!error && newCli) {
                clientes.push(newCli[0]);
                window.closeModal('modalCliente');
                form.reset();
                renderCrm();
                showToast(`Cliente "${name}" salvo no banco!`, 'success');
                if (updateCallbacks) updateCallbacks();
            } else {
                showToast('Erro ao salvar cliente.', 'error');
            }
        });
    }

    const grid = document.getElementById('crmGrid');
    if (grid) {
        grid.addEventListener('click', async (e) => {
            const btnDel = e.target.closest('[data-del-client]');
            if (btnDel) {
                const id = parseInt(btnDel.dataset.delClient);
                if (confirm("Deseja excluir este cliente do banco?")) {
                    const { error } = await supabase.from('clientes').delete().eq('id', id);
                    if (!error) {
                        const index = clientes.findIndex(c => c.id === id);
                        if (index !== -1) {
                            clientes.splice(index, 1);
                            renderCrm();
                            showToast(`Cliente removido.`, 'error');
                            if (updateCallbacks) updateCallbacks();
                        }
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
