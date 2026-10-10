import { produtos, movimentos } from './state.js';
import { supabase } from './supabase.js';
import { showToast } from './toast.js';

// ... (mantenha a função renderEstoque igual)

export function initEstoqueListeners(updateCallbacks) {
    const form = document.getElementById('formProduto');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('prodName').value;
            const price = parseFloat(document.getElementById('prodPrice').value);
            const stock = parseInt(document.getElementById('prodStock').value);
            const category = document.getElementById('prodCategory').value;

            // Insere no Supabase (Produtos)
            const { data: newProd, error: errProd } = await supabase
                .from('produtos')
                .insert([{ name, price, stock, category }])
                .select();

            if (errProd) {
                showToast('Erro ao salvar produto no banco!', 'error');
                return;
            }

            if (newProd) produtos.push(newProd[0]);

            // Insere no Supabase (Movimentos)
            const movData = {
                date: new Date().toLocaleString('pt-BR'),
                type: "Entrada Inicial",
                prod_name: name,
                qtd: stock,
                obs: "Cadastro do produto"
            };

            const { data: newMov, error: errMov } = await supabase
                .from('movimentos')
                .insert([movData])
                .select();

            if (!errMov && newMov) movimentos.unshift(newMov[0]);

            window.closeModal('modalProduto');
            form.reset();
            renderEstoque();
            showToast(`Produto "${name}" cadastrado na nuvem!`, 'success');
            if (updateCallbacks) updateCallbacks();
        });
    }

    const tbody = document.getElementById('estoqueTableBody');
    if (tbody) {
        tbody.addEventListener('click', async (e) => {
            const btnMov = e.target.closest('.btn-mov');
            const btnDel = e.target.closest('[data-del]');

            if (btnMov) {
                window.openMovModal(parseInt(btnMov.dataset.id), btnMov.dataset.type);
            }

            if (btnDel) {
                const id = parseInt(btnDel.dataset.del);
                if (confirm("Deseja excluir este produto do banco?")) {
                    const { error } = await supabase.from('produtos').delete().eq('id', id);
                    if (!error) {
                        const index = produtos.findIndex(p => p.id === id);
                        if (index !== -1) {
                            const removedName = produtos[index].name;
                            produtos.splice(index, 1);
                            renderEstoque();
                            showToast(`Produto "${removedName}" excluído.`, 'error');
                            if (updateCallbacks) updateCallbacks();
                        }
                    } else {
                        showToast('Erro ao excluir produto.', 'error');
                    }
                }
            }
        });
    }

    const searchInput = document.getElementById('searchEstoque');
    if (searchInput) {
        searchInput.addEventListener('input', renderEstoque);
    }
}
