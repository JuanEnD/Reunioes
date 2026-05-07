// Abre o Modal de Avisos
function abrirEventos() {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-titulo').innerText = "🔔 Avisos dos Grupos";
    document.getElementById('modal-corpo').innerHTML = `
        <p>• Congresso 2026: 27 a 29 de Julho.</p>
        <p>• Saída de Campo: Sábado às 09:00h.</p>
    `;
    modal.style.display = "flex";
}

function fecharModal() {
    document.getElementById('modal-info').style.display = "none";
}

// Modo Escuro
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
    document.getElementById('btn-dark').innerText = isLight ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('light-mode');
        document.getElementById('btn-dark').innerText = '☀️';
    }
});

// Fecha ao clicar fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('modal-info');
    if (event.target == modal) fecharModal();
}