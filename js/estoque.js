import { produtos, movimentos, saveStorage } from './state.js';

export function renderEstoque() {
    const query = document.getElementById('searchEstoque').value.toLowerCase();
    const tbody = document.getElementById('estoqueTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = produtos.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Nenhum produto encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        tbody.innerHTML += `
            <tr class="border-b hover:bg-slate-50">
                <td class="p-3 font-medium text-slate-800">${p.name}</td>
                <td class="p-3 text-slate-500">${p.category}</td>
                <td class="p-3 font-semibold text-slate-700">R$ ${Number(p.price).toFixed(2)}</td>
                <td class="p-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold ${p.stock <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${p.stock} un
                    </span>
                </td>
                <td class="p-3 text-center space-x-2">
                    <button data-id="${p.id}" data-type="Entrada" class="btn-mov bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded font-medium">+ Entrada</button>
                    <button data-id="${p.id}" data-type="Saída" class="btn-mov bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1.5 rounded font-medium">- Saída</button>
                    <button data-del="${p.id}" class="text-rose-600 hover:underline text-xs">Excluir</button>
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
