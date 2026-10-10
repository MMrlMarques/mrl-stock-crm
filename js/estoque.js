import { produtos, movimentos, saveStorage } from './state.js';

export function renderEstoque() {
    const query = document.getElementById('searchEstoque').value.toLowerCase();
    const tbody = document.getElementById('estoqueTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = produtos.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhum produto encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/50 transition-colors">
                <td class="p-4 font-medium text-white">${p.name}</td>
                <td class="p-4 text-slate-400 text-xs">${p.category}</td>
                <td class="p-4 font-semibold text-indigo-400">R$ ${Number(p.price).toFixed(2)}</td>
                <td class="p-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold ${p.stock <= 3 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                        ${p.stock} un
                    </span>
                </td>
                <td class="p-4 text-center space-x-2">
                    <button data-id="${p.id}" data-type="Entrada" class="btn-mov bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all">+ Entrada</button>
                    <button data-id="${p.id}" data-type="Saída" class="btn-mov bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all">- Saída</button>
                    <button data-del="${p.id}" class="text-rose-500 hover:text-rose-400 text-xs transition-colors">Excluir</button>
                </td>
            </tr>
        `;
    });
}

export function initEstoqueListeners(updateCallbacks) {
    const form = document.getElementById('formProduto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prodName').value;
            const price = parseFloat(document.getElementById('prodPrice').value);
            const stock = parseInt(document.getElementById('prodStock').value);
            const category = document.getElementById('prodCategory').value;

            const newId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
            produtos.push({ id: newId, name, price, stock, category });
            
            movimentos.unshift({
                date: new Date().toLocaleString('pt-BR'),
                type: "Entrada Inicial",
                prodName: name,
                qtd: stock,
                obs: "Cadastro do produto"
            });

            saveStorage();
            window.closeModal('modalProduto');
            form.reset();
            renderEstoque();
            if (updateCallbacks) updateCallbacks();
        });
    }

    const tbody = document.getElementById('estoqueTableBody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const btnMov = e.target.closest('.btn-mov');
            const btnDel = e.target.closest('[data-del]');

            if (btnMov) {
                window.openMovModal(parseInt(btnMov.dataset.id), btnMov.dataset.type);
            }

            if (btnDel) {
                const id = parseInt(btnDel.dataset.del);
                if (confirm("Deseja excluir este produto?")) {
                    const index = produtos.findIndex(p => p.id === id);
                    if (index !== -1) {
                        produtos.splice(index, 1);
                        saveStorage();
                        renderEstoque();
                        if (updateCallbacks) updateCallbacks();
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
