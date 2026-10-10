import { movimentos, produtos, saveStorage } from './state.js';

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
                <td class="p-4 font-medium text-white">${m.prodName}</td>
                <td class="p-4 font-bold text-slate-200">${m.qtd}</td>
                <td class="p-4 text-slate-400 text-xs">${m.obs}</td>
            </tr>
        `;
    });
}

function exportToPDF() {
    if (movimentos.length === 0) {
        alert("Não há movimentações para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Cor escura
    doc.text("Mrl Stock & CRM — Relatório de Movimentações", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Cinza slate
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 26);

    // Mapear dados para a tabela
    const tableData = movimentos.map(m => [
        m.date,
        m.type,
        m.prodName,
        m.qtd.toString(),
        m.obs
    ]);

    // Gerar tabela estilizada via autoTable
    doc.autoTable({
        startY: 34,
        head: [['Data/Hora', 'Tipo', 'Produto', 'Qtd', 'Observação']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
            fillColor: [79, 70, 229], // Tom Indigo correspondente ao tema
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: { 
            fontSize: 9, 
            cellPadding: 4,
            textColor: [51, 65, 85]
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        }
    });

    // Salvar o arquivo PDF automaticamente no navegador
    doc.save(`relatorio-movimentacoes-${new Date().toISOString().slice(0, 10)}.pdf`);
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

    const btnExport = document.getElementById('btnExportPdf');
    if (btnExport) {
        btnExport.addEventListener('click', exportToPDF);
    }
}
