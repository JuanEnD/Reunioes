// --- FUNÇÃO DARK MODE ---
function toggleDarkMode() {
    // Alterna a classe 'light-mode' no body
    document.body.classList.toggle('light-mode');
    
    const btn = document.getElementById('btn-dark');
    const isLight = document.body.classList.contains('light-mode');
    
    // Muda o ícone do botão
    if (btn) {
        btn.innerText = isLight ? '☀️' : '🌙';
    }

    // Salva a preferência para não resetar ao atualizar a página
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
}

// Verifica o tema salvo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('btn-dark');
        if (btn) btn.innerText = '☀️';
    }
});

// --- FUNÇÃO TROCAR SEMANA ---
function trocarSemana(numero, btn) {
    // 1. Esconde todos os blocos de semana
    document.querySelectorAll('.semana-bloco').forEach(bloco => {
        bloco.style.display = 'none';
        bloco.classList.remove('ativa');
    });

    // 2. Mostra a semana clicada
    const semanaSelecionada = document.getElementById('semana' + numero);
    if (semanaSelecionada) {
        semanaSelecionada.style.display = 'block';
        semanaSelecionada.classList.add('ativa');
    }

    // 3. Muda o visual dos botões
    document.querySelectorAll('.btn-semana').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
}

// --- FUNÇÕES DOS MODAIS (AVISOS E DONATIVOS) ---

function abrirEventos() {
    const modal = document.getElementById('modal-info');
    const titulo = document.getElementById('modal-titulo');
    const corpo = document.getElementById('modal-corpo');

    titulo.innerText = "🔔 Avisos";
    
    // Aqui você pode editar os avisos conforme a necessidade da semana
    corpo.innerHTML = `
        <div style="text-align: left; line-height: 1.6;">
            <p style="margin-bottom: 10px;"><b>• Reunião de Meio de Semana:</b> Quinta-feira às 19:30h.</p>
            <p style="margin-bottom: 10px;"><b>• Reunião de Fim de Semana:</b> Domingo às 18:00h.</p>
            <p style="margin-bottom: 10px;"><b>• Limpeza do Salão:</b> Grupo responsável esta semana: <b>Paroaras</b>.</p>
            <p style="margin-bottom: 10px;"><b>• Carrinho/Testemunho Público:</b> Consultar o quadro de horários no grupo.</p>
            <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
            <p style="font-size: 0.9rem; color: var(--text-secundario);"><i>"Mantenha-se atento aos anúncios lidos na reunião."</i></p>
        </div>
    `;
    
    modal.style.display = "block";
}

function abrirDonativos() {
    const modal = document.getElementById('modal-info');
    const titulo = document.getElementById('modal-titulo');
    const corpo = document.getElementById('modal-corpo');

    titulo.innerText = "💰 Donativos";
    
    corpo.innerHTML = `
        <div style="text-align: left; line-height: 1.6;">
            <p style="margin-bottom: 15px;">Agradecemos seu apoio generoso à obra local e mundial.</p>
            
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><b>Via Site/App:</b></p>
                <p>Acesse <a href="https://donate.jw.org" target="_blank" style="color: #4a90e2;">donate.jw.org</a> e selecione a nossa congregação.</p>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                <p><b>Localmente:</b></p>
                <p>Utilize as caixas de contribuição identificadas no fundo do Salão do Reino.</p>
            </div>
        </div>
    `;
    
    modal.style.display = "block";
}

function fecharModal() {
    document.getElementById('modal-info').style.display = "none";
}

// Fecha o modal se clicar fora da caixa branca
window.onclick = function(event) {
    const modal = document.getElementById('modal-info');
    if (event.target == modal) {
        fecharModal();
    }
}

// --- FUNÇÕES DE INTERAÇÃO (AVISOS E DONATIVOS) ---

// --- FUNÇÕES DE INTERAÇÃO (AVISOS E DONATIVOS) ---

function abrirEventos() {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-titulo').innerText = "🔔 Avisos";
    
    // Conteúdo formatado igual ao sistema anterior
    document.getElementById('modal-corpo').innerHTML = `
        <div style="text-align: left; padding: 10px; line-height: 1.6;">
            <p>• <b>Congresso:</b> 27 a 29 de Julho de 2026.</p>        
            <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
            <p style="font-size: 0.85rem; color: #aaa;">Verifique o quadro de anúncios para mais detalhes.</p>
        </div>
    `;
    modal.style.display = "block";
}

function abrirDonativos() {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-titulo').innerText = "💰 Donativos";
    
    document.getElementById('modal-corpo').innerHTML = `
            <div style="text-align: left; padding: 0 10px; line-height: 1.6;">

            <p style="margin-top: -04px;">Contribuições para a obra mundial e despesas locais podem ser feitas de duas formas:</p>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin: 10px 0;">
                <b>Online:</b> Acesse <a href="https://donate.jw.org" target="_blank" style="color: #38761d;">donate.jw.org</a>.
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                <b>Local:</b> Caixas de contribuição no fundo do salão.
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                <b> Chave PIX da congregação:</b> jardim.uniao@outlook.com 
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                <b> Chave PIX para Obra Mundial:</b> 33.755.687/0001-24 <b>Titular:</b> ASSOCIAÇÃO TORRE DE VIGIA DE BÍBLIAS E TRATADOS
            </div>
           
        </div>
    `;
    modal.style.display = "block";
}

// Garante que o modal feche corretamente
function fecharModal() {
    document.getElementById('modal-info').style.display = "none";
}