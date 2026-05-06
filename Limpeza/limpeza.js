// Função para alternar o modo
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('light-mode');

    // Salva a escolha do usuário
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('tema', 'claro');
    } else {
        localStorage.setItem('tema', 'escuro');
    }
}

// Quando a página carregar, verifica o que foi salvo anteriormente
window.onload = function() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
};