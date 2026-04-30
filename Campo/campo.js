/**
 * Script para Saída de Campo
 * Gerencia o Modo Escuro e interações da tabela
 */

// 1. Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já tinha o modo claro ativado anteriormente
    const isLightMode = localStorage.getItem('lightMode') === 'true';
    
    if (isLightMode) {
        document.body.classList.add('light-mode');
        atualizarTextoBotao(true);
    }
});

// 2. Função para alternar entre Modo Claro e Escuro
function toggleDarkMode() {
    const body = document.body;
    const isLight = body.classList.toggle('light-mode');
    
    localStorage.setItem('lightMode', isLight);
    
    // Atualiza o texto do botão conforme o modo
    const btn = document.querySelector('.dark-toggle');
    if (btn) {
        // Se está em Light Mode, o botão oferece voltar para o Dark
        btn.innerHTML = isLight ? '🌙 Modo escuro' : '☀️ Modo claro';
    }
}

// 3. Atualiza o ícone/texto do botão de alternância
function atualizarTextoBotao(isLight) {
    const btn = document.querySelector('.dark-toggle');
    if (btn) {
        btn.innerHTML = isLight ? '🌙 Modo escuro' : '☀️ Modo claro';
    }
}

/**
 * DICA DE EXPANSÃO:
 * Se você quiser que as linhas da tabela fiquem em destaque ao passar o mouse
 * ou ao clicar (útil para mobile), pode usar a lógica abaixo:
 */
const linhasTabela = document.querySelectorAll('.tabela-dados tr');

linhasTabela.forEach(linha => {
    linha.addEventListener('click', () => {
        // Remove destaque de todas
        linhasTabela.forEach(l => l.style.backgroundColor = '');
        
        // Adiciona destaque apenas na clicada (ajuda a não se perder na leitura)
        const highlightColor = document.body.classList.contains('light-mode') 
            ? 'rgba(56, 118, 29, 0.1)' 
            : 'rgba(56, 118, 29, 0.3)';
            
        linha.style.backgroundColor = highlightColor;
    });
});