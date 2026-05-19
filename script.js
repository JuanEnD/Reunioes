// =========================================================================
// 1. CONFIGURAÇÃO DO BANCO DE DADOS (GOOGLE SHEETS)
// =========================================================================
// Substitua o link abaixo pelo link gerado na opção: 
// Arquivo > Compartilhar > Publicar na Web > Mudar para "Valores separados por vírgulas (.csv)"
const LINK_GOOGLE_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS33z4kYkW8f_Fa3Ceb4q3K7bGCq-AeHFv2wBLSd6lIIAXeX3-MPyTzC-DMLABasg7wesdsziS8Zkwq/pub?gid=788586523&single=true&output=csv";

let territoriosGlobal = [];

// =========================================================================
// 2. CARREGAR DADOS DA PLANILHA EM TEMPO REAL
// =========================================================================
async function carregarDados() {
    try {
        const response = await fetch(LINK_GOOGLE_PLANILHA);
        if (!response.ok) throw new Error("Não foi possível conectar à planilha pública do Google.");
        
        const csvTexto = await response.text();
        
        // Divide o texto por quebras de linha para pegar cada registro
        const linhas = csvTexto.split('\n');
        const dadosConvertidos = [];

        // Ignora a linha 0 (cabeçalho) e percorre as linhas de dados reais
        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue; // Pula linhas em branco por segurança

            // Esta expressão regular separa por vírgulas, mas ignora vírgulas dentro de aspas
            const colunas = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linha.split(',');

            // Remove aspas extras que o Google Sheets coloca automaticamente no texto
            const limparTexto = (texto) => texto ? texto.replace(/^"|"$/g, '').trim() : '';

            // Mapeia o objeto de forma idêntica à estrutura que vinha do Supabase
            dadosConvertidos.push({
                id: limparTexto(colunas[0]),
                numero: limparTexto(colunas[1]),
                localidade: limparTexto(colunas[2]),
                grupo: limparTexto(colunas[3]),
                status: limparTexto(colunas[4]),
                foto_url: limparTexto(colunas[5])
            });
        }

        // Ordena numericamente pelo número do setor do mapa de forma crescente
        territoriosGlobal = dadosConvertidos.sort((a, b) => parseInt(a.numero || 0) - parseInt(b.numero || 0));
        
        // Dispara a montagem visual dos cards na tela
        renderizarMapas();

    } catch (error) {
        console.error('Erro ao buscar ou processar dados do Google Planilhas:', error);
    }
}

// =========================================================================
// 3. RENDERIZAR MAPAS NA INTERFACE
// =========================================================================
function renderizarMapas() {
    // Lista exata de ids de grupos que você possui no HTML
    const grupos = ['parque-dois-irmaos', 'passare', 'marrocos', 'paroaras', 'jardim-uniao'];
    
    grupos.forEach(grupo => {
        let containerId = `mapas-${grupo}`;
        if (grupo === 'parque-dois-irmaos') containerId = 'mapas-parque-dois-irmaos';
        if (grupo === 'jardim-uniao') containerId = 'mapas-jardim-uniao';

        const container = document.getElementById(containerId);
        if (!container) return; // Passa adiante se o container não existir na tela

        container.innerHTML = '';
        
        // Filtra os territórios correspondentes a este grupo específico
        const mapasDoGrupo = territoriosGlobal.filter(t => t.grupo && t.grupo.toLowerCase().trim() === grupo);

        // Gera a estrutura HTML de cada card
        container.innerHTML = mapasDoGrupo.map(mapa => `
            <div class="card-mapa">
                <div class="badge-numero">${mapa.numero}</div>
                <div class="mapa-placeholder" onclick="abrirPopUp('${mapa.foto_url}')"
                     style="height:180px; background-image:url('${mapa.foto_url}'); background-size:contain; background-repeat:no-repeat; background-position:center; background-color:#2a2a2a; cursor:zoom-in;">
                </div>
                <div style="padding:15px;">
                    <p style="margin:0 0 10px 0; font-size: 0.9rem;">📍 <b>Local:</b> ${mapa.localidade || 'Setor'}</p>
                    
                    <input type="text" class="input-quadras" placeholder="O que foi feito? ex: Q1, Q2..." 
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
// 4. FUNÇÕES DE SUPORTE EXTERNAS (INTEGRADAS COM AS AÇÕES DO HTML)
// =========================================================================

// Função para Alternar o Tema Escuro / Claro
window.toggleDarkMode = function() {
    document.body.classList.toggle('light-mode');
    const btn = document.getElementById('btn-dark');
    const isLight = document.body.classList.contains('light-mode');
    
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
    if (btn) btn.innerText = isLight ? '☀️' : '🌙';
};

// Função para alternar visualmente as seções dos Grupos
window.mostrarGrupo = function(id, btn) {
    document.querySelectorAll('.secao-grupo').forEach(s => s.classList.remove('ativa'));
    const secaoAlvo = document.getElementById(id);
    if (secaoAlvo) secaoAlvo.classList.add('ativa');
    
    document.querySelectorAll('.btn-grupo').forEach(b => b.classList.remove('ativo'));
    if (btn) btn.classList.add('ativo');
};

// Função de Busca Dinâmica por Texto (Ex: digitando o número do setor)
window.filtrarMapas = function() {
    const termo = document.getElementById('inputBusca').value.toLowerCase().trim();
    document.querySelectorAll('.card-mapa').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(termo) ? "block" : "none";
    });
};

// Função para abrir o Pop-Up com a Imagem Ampliada
window.abrirPopUp = function(url) {
    document.getElementById('modal-titulo').innerText = "Mapa Ampliado";
    document.getElementById('modal-corpo').innerHTML = `<img src="${url}" style="width:100%; border-radius:8px; display:block; max-height:70vh; object-fit:contain;">`;
    document.getElementById('modal-info').style.display = "block";
};

// Função para Fechar o Modal
window.fecharModal = function() { 
    document.getElementById('modal-info').style.display = "none"; 
};

// Inicializador de preferências de tema e carregamento automático
document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('btn-dark');
        if (btn) btn.innerText = '☀️';
    }
    
    // Executa a busca dos dados na planilha do Google Sheets
    carregarDados();
});