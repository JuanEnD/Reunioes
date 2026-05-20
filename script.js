// =========================================================================
// 1. CONFIGURAÇÃO DO BANCO DE DADOS (GOOGLE SHEETS)
// =========================================================================
// Substitua o link abaixo pelo link gerado na opção: 
// Arquivo > Compartilhar > Publicar na Web > Mudar para "Valores separados por vírgulas (.csv)"
const LINK_GOOGLE_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS33z4kYkW8f_Fa3Ceb4q3K7bGCq-AeHFv2wBLSd6lIIAXeX3-MPyTzC-DMLABasg7wesdsziS8Zkwq/pub?gid=788586523&single=true&output=csv";
// Link de GRAVAÇÃO (O URL do App da Web que você acabou de gerar no Passo 2)
const URL_GRAVACAO_GOOGLE = "https://script.google.com/macros/s/AKfycbwfYv7UeOiEF8Yw45R0YmYx7003dPfy_0xaR8eh_0W21maHKBPleG3NkCdCqpvtj7Hjww/exec";
// ------------------------------------------------------------------------------------------
//  Variável global para armazenar os dados dos territórios carregados da planilha, permitindo acesso fácil em toda a aplicação
let territoriosGlobal = [];

// =======================================================================
// 2. CARREGAR DADOS DA PLANILHA  EM TEMPO REAL (SEM CACHE)
// =========================================================================
async function carregarDados() {
    try {
        // Adiciona um quebrador de cache (&_t=) para forçar o Google Sheets a entregar o dado mais recente
        const urlSemCache = `${LINK_GOOGLE_PLANILHA}&_t=${new Date().getTime()}`;
        
        const response = await fetch(urlSemCache);
        if (!response.ok) throw new Error("Não foi possível conectar à planilha.");
        
        const csvTexto = await response.text();
        const linhas = csvTexto.split('\n');
        const dadosConvertidos = [];

        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;

            const colunas = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linha.split(',');
            const limparTexto = (texto) => texto ? texto.replace(/^"|"$/g, '').trim() : '';

            let textoQuadras = limparTexto(colunas[6]);
            if (!textoQuadras || textoQuadras.toLowerCase() === 'null' || textoQuadras.toLowerCase() === 'undefined') {
                textoQuadras = '';
            }

            dadosConvertidos.push({
                id: limparTexto(colunas[0]),
                numero: limparTexto(colunas[1]),
                localidade: limparTexto(colunas[2]),
                grupo: limparTexto(colunas[3]),
                status: limparTexto(colunas[4]),
                foto_url: limparTexto(colunas[5]),
                quadras: textoQuadras
            });
        }

        territoriosGlobal = dadosConvertidos.sort((a, b) => parseInt(a.numero || 0) - parseInt(b.numero || 0));
        renderizarMapas();

    } catch (error) {
        console.error('Erro ao buscar dados do Google Planilhas:', error);
    }
}

// =========================================================================
// 3. RENDERIZAR MAPAS NA INTERFACE
// =========================================================================
function renderizarMapas() {
    const grupos = ['parque-dois-irmaos', 'passare', 'marrocos', 'paroaras', 'jardim-uniao'];
    
    grupos.forEach(grupo => {
        let containerId = `mapas-${grupo}`;
        if (grupo === 'parque-dois-irmaos') containerId = 'mapas-parque-dois-irmaos';
        if (grupo === 'jardim-uniao') containerId = 'mapas-jardim-uniao';

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const mapasDoGrupo = territoriosGlobal.filter(t => t.grupo && t.grupo.toLowerCase().trim() === grupo);

        container.innerHTML = mapasDoGrupo.map(mapa => `
            <div class="card-mapa">
                <div class="badge-numero">${mapa.numero}</div>
                <div class="mapa-placeholder" onclick="abrirPopUp('${mapa.foto_url}')"
                     style="height:180px; background-image:url('${mapa.foto_url}'); background-size:contain; background-repeat:no-repeat; background-position:center; background-color:#2a2a2a; cursor:zoom-in;">
                </div>
                <div style="padding:15px;">
                    <p style="margin:0 0 10px 0; font-size: 0.9rem;">📍 <b>Local:</b> ${mapa.localidade || 'Setor'}</p>
                    
                    <input type="text" class="input-quadras" 
                           id="input-mapa-${mapa.id}"
                           value="${mapa.quadras}"
                           onchange="salvarDadosNaPlanilha('${mapa.id}', this)"
                           placeholder="O que foi feito? ex: Q1, Q2..." 
                           style="width:100%; padding:12px; background:#2a2a2a; border:1px solid #444; color:#fff; border-radius:8px; box-sizing:border-box; margin-bottom:10px;">
                    
                    <div class="acoes-card">
                        <button class="btn-ver-cartao" onclick="abrirPopUp('${mapa.foto_url}')"
                                style="width:100%; padding:12px; border-radius:8px; border:none; background:#38761d; color:#fff; font-weight:bold; cursor:pointer;">
                            VER FOTO AMPLIADA
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// =========================================================================
// 4. SALVAR DADOS DE VOLTA NA PLANILHA ONLINE (E ATUALIZAR MEMÓRIA LOCAL)
// =========================================================================
window.salvarDadosNaPlanilha = async function(idMapa, inputElement) {
    const textoDigitado = inputElement.value;

    inputElement.style.border = "1px solid #f1c40f";

    try {

        const resposta = await fetch(URL_GRAVACAO_GOOGLE, {
            method: "POST",
            body: new URLSearchParams({
                id: idMapa,
                quadras: textoDigitado
            })
        });

        console.log("Resposta:", resposta);

        const territorio = territoriosGlobal.find(t => t.id === idMapa);
        if (territorio) {
            territorio.quadras = textoDigitado;
        }

        inputElement.style.border = "1px solid #27ae60";
        setTimeout(() => {
            inputElement.style.border = "1px solid #444";
        }, 2000);

    } catch (error) {

        console.error("Erro ao salvar dados na planilha:", error);
        inputElement.style.border = "1px solid #e74c3c";

    }
};
// =========================================================================
// 5. FUNÇÕES DE SUPORTE WINDOWS (DARK MODE, BUSCA, MODAL)
// =========================================================================
window.toggleDarkMode = function() {
    document.body.classList.toggle('light-mode');
    const btn = document.getElementById('btn-dark');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
    if (btn) btn.innerText = isLight ? '☀️' : '🌙';
};

window.mostrarGrupo = function(id, btn) {
    document.querySelectorAll('.secao-grupo').forEach(s => s.classList.remove('ativa'));
    const secaoAlvo = document.getElementById(id);
    if (secaoAlvo) secaoAlvo.classList.add('ativa');
    document.querySelectorAll('.btn-grupo').forEach(b => b.classList.remove('ativo'));
    if (btn) btn.classList.add('ativo');
};

window.filtrarMapas = function() {
    const termo = document.getElementById('inputBusca').value.toLowerCase().trim();
    document.querySelectorAll('.card-mapa').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(termo) ? "block" : "none";
    });
};

window.abrirPopUp = function(url) {
    document.getElementById('modal-titulo').innerText = "Mapa Ampliado";
    document.getElementById('modal-corpo').innerHTML = `<img src="${url}" style="width:100%; border-radius:8px; display:block; max-height:70vh; object-fit:contain;">`;
    document.getElementById('modal-info').style.display = "block";
};

window.fecharModal = function() { 
    document.getElementById('modal-info').style.display = "none"; 
};

document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('btn-dark');
        if (btn) btn.innerText = '☀️';
    }
    carregarDados();
});

/// 