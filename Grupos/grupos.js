function abrirEventos() {
    document.getElementById('quadroEventos').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fecharEventos() {
    document.getElementById('quadroEventos').style.display = 'none';
}

function toggleDarkMode() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('lightMode', isLight);
    atualizarBotaoDark(isLight);
}

function atualizarBotaoDark(isLight) {
    const btn = document.querySelector('.dark-toggle');
    if (btn) btn.innerHTML = isLight ? '☀️ Modo claro' : '🌙 Modo escuro';
}

document.addEventListener('DOMContentLoaded', () => {
    const isLight = localStorage.getItem('lightMode') === 'true';
    if (isLight) document.body.classList.add('light-mode');
    atualizarBotaoDark(isLight);
});