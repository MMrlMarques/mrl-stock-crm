import { clientes } from './state.js';
import { supabase } from './supabase.js';
import { showToast } from './toast.js';

// ... (mantenha renderCrm igual)

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
