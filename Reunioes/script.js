// --- FUNÇÃO DARK MODE ---
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    
    const btn = document.getElementById('btn-dark');
    const isLight = document.body.classList.contains('light-mode');
    
    if (btn) {
        btn.innerText = isLight ? '☀️' : '🌙';
    }

    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
}

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
    if (btn) {
        btn.classList.add('ativo');
        
        // CORREÇÃO: Faz o botão deslizar suavemente para o centro da barra se estiver escondido
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// --- FUNÇÕES DOS MODAIS ---
function abrirEventos() {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-titulo').innerText = "🔔 Avisos";
    
    document.getElementById('modal-corpo').innerHTML = `
        <div style="text-align: left; padding: 10px; line-height: 1.6;">
            <p style="margin-bottom: 10px;">• <b>Congresso:</b> 27 a 29 de Julho de 2026.</p>        
            <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
            <p style="font-size: 0.85rem; color: #aaa;">Verifique o quadro de anúncios para mais detalhes.</p>
        </div>
    `;
    modal.style.display = "flex";
}

function abrirDonativos() {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-titulo').innerText = "💰 Donativos";
    
    document.getElementById('modal-corpo').innerHTML = `
        <div style="text-align: left; padding: 0 10px; line-height: 1.6;">
            <p style="margin-top: -4px; margin-bottom: 10px;">Contribuições para a obra mundial e despesas locais podem ser feitas de duas formas:</p>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin: 10px 0;">
                <b>Online:</b> Acesse <a href="https://donate.jw.org" target="_blank" style="color: #4a90e2;">donate.jw.org</a>.
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <b>Local:</b> Caixas de contribuição no fundo do salão.
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <b>Chave PIX da congregação:</b> jardim.uniao@outlook.com 
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                <b>Chave PIX para Obra Mundial:</b> 33.755.687/0001-24 <br><b>Titular:</b> ASSOCIAÇÃO TORRE DE VIGIA
            </div>
        </div>
    `;
    modal.style.display = "flex";
}

function fecharModal() {
    document.getElementById('modal-info').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-info');
    if (event.target == modal) {
        fecharModal();
    }
}

// --- ADICIONAL: ARRASTAR O CONTEÚDO COM O DEDO (SWIPE) NO CELULAR ---
document.addEventListener('DOMContentLoaded', () => {
    let toqueInicioX = 0;
    let toqueFimX = 0;

    // Captura onde o toque começou
    document.addEventListener('touchstart', (e) => {
        toqueInicioX = e.changedTouches[0].screenX;
    }, { passive: true });

    // Captura onde o toque terminou
    document.addEventListener('touchend', (e) => {
        toqueFimX = e.changedTouches[0].screenX;
        tratarDeslize();
    }, { passive: true });

    function tratarDeslize() {
        const limiteDistancia = 60; // Pixels mínimos para validar o movimento
        const blocoAtual = document.querySelector('.semana-bloco.ativa');
        if (!blocoAtual) return;

        const numeroAtual = parseInt(blocoAtual.id.replace('semana', ''), 10);
        if (isNaN(numeroAtual)) return;

        let proximoNumero = numeroAtual;

        // Arrastou para a esquerda -> Avança semana
        if (toqueInicioX - toqueFimX > limiteDistancia) {
            proximoNumero = numeroAtual + 1;
        } 
        // Arrastou para a direita -> Retrocede semana
        else if (toqueFimX - toqueInicioX > limiteDistancia) {
            proximoNumero = numeroAtual - 1;
        } else {
            return;
        }

        const proximoBloco = document.getElementById('semana' + proximoNumero);
        if (proximoBloco) {
            const botoes = document.querySelectorAll('.btn-semana');
            let btnCorrespondente = null;

            botoes.forEach(b => {
                const attrOnclick = b.getAttribute('onclick');
                if (attrOnclick && attrOnclick.includes(proximoNumero)) {
                    btnCorrespondente = b;
                }
            });

            if (btnCorrespondente) {
                trocarSemana(proximoNumero, btnCorrespondente);
            }
        }
    }
});