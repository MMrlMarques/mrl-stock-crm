export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const styles = {
        success: 'bg-emerald-600/90 text-white border-emerald-500/30 shadow-emerald-900/20',
        error: 'bg-rose-600/90 text-white border-rose-500/30 shadow-rose-900/20',
        info: 'bg-indigo-600/90 text-white border-indigo-500/30 shadow-indigo-900/20'
    };
    
    toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md text-xs font-semibold flex items-center gap-3 transition-all duration-300 transform translate-y-2 opacity-0 ${styles[type] || styles.success}`;
    
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
