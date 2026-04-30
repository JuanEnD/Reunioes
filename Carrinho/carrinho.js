function toggleDarkMode() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('lightMode', isLight);
    atualizarBotaoDark(isLight);
}

function atualizarBotaoDark(isLight) {
    const btn = document.querySelector('.dark-toggle');
    if (btn) btn.innerHTML = isLight ? '🌙 Modo escuro' : '☀️ Modo claro';
}

function trocarSemana(numeroSemana) {
    // Esconde todas as semanas
    const todasSemanas = document.querySelectorAll('.semana');
    todasSemanas.forEach(s => s.classList.remove('ativa'));

    // Remove destaque dos botões
    const botoes = document.querySelectorAll('.seletor-semana button');
    botoes.forEach(b => b.classList.remove('ativo'));

    // Mostra a semana selecionada
    const semanaAlvo = document.getElementById('semana' + numeroSemana);
    if (semanaAlvo) {
        semanaAlvo.classList.add('ativa');
    }

    // Destaca o botão clicado
    if (event) {
        event.currentTarget.classList.add('ativo');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isLight = localStorage.getItem('lightMode') === 'true';
    if (isLight) document.body.classList.add('light-mode');
    atualizarBotaoDark(isLight);

    // Garante que o botão 1 comece ativo visualmente
    const botoes = document.querySelectorAll('.seletor-semana button');
    if (botoes.length > 0) botoes[0].classList.add('ativo');
});