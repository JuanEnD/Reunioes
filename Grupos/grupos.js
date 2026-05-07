// Abre o Modal de Avisos (Pop-up centralizado)
function abrirEventos() {
    const modal = document.getElementById('modal-info');
    const titulo = document.getElementById('modal-titulo');
    const corpo = document.getElementById('modal-corpo');

    if (modal) {
        titulo.innerText = "🔔 Avisos dos Grupos";
        corpo.innerHTML = `
            <div style="text-align: left;">
                <p>• Congresso 2026: 27 a 29 de Julho.</p>
                <p>• Saída de Campo: Sábado às 09:00h.</p>
            </div>
        `;
        modal.style.display = "flex"; // Usa flex para centralizar o conteúdo
    }
}

function fecharModal() {
    const modal = document.getElementById('modal-info');
    if (modal) modal.style.display = "none";
}

// Fecha o modal se clicar fora da caixa
window.onclick = function(event) {
    const modal = document.getElementById('modal-info');
    if (event.target == modal) {
        fecharModal();
    }
}

// Funções de Modo Escuro
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
    
    const btn = document.getElementById('btn-dark');
    if (btn) btn.innerText = isLight ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('btn-dark');
        if (btn) btn.innerText = '☀️';
    }
});
// Fecha ao clicar fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('modal-info');
    if (event.target == modal) fecharModal();
}