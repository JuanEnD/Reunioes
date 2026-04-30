// 1. CONFIGURAÇÃO
const _supabase = supabase.createClient(
    'https://mxuvkexxvqnqhmdhbhnj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dXZrZXh4dnFucWhtZGhiaG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDU2ODYsImV4cCI6MjA5Mjg4MTY4Nn0.Jxwd1jsG3VIuSShtXnxOS25g5de92oY30EnB0louzzY'
);

let territoriosGlobal = [];

// 2. CARREGAR DADOS
async function carregarDados() {
    const { data, error } = await _supabase
        .from('territorios')
        .select('*')
        .order('numero', { ascending: true });

    if (error) {
        console.error('Erro ao buscar dados:', error);
    } else {
        territoriosGlobal = data;
        renderizarMapas();
    }
}

// 3. RENDERIZAR MAPAS (Sem Status e Sem Botão de Status)
function renderizarMapas() {
    const grupos = ['parque-dois-irmaos', 'passare', 'marrocos', 'paroaras', 'jardim-uniao'];
    
    grupos.forEach(grupo => {
        let containerId = `mapas-${grupo}`;
        if (grupo === 'parque-dois-irmaos') containerId = 'mapas-parque-dois-irmaos';
        if (grupo === 'jardim-uniao') containerId = 'mapas-jardim-uniao';

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const mapasDoGrupo = territoriosGlobal.filter(t => t.grupo.toLowerCase() === grupo);

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

// 4. FUNÇÕES DE SUPORTE
// --- FUNÇÃO DARK MODE (Universal) ---
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const btn = document.getElementById('btn-dark');
    
    // Salva a preferência do usuário
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('tema', isLight ? 'claro' : 'escuro');
    
    if (btn) {
        btn.innerText = isLight ? '☀️' : '🌙';
    }
}

// Verifica o tema ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('btn-dark');
        if (btn) btn.innerText = '☀️';
    }
});

function trocarSemana(numero) {
    // Esconde todas as semanas
    document.querySelectorAll('.semana-bloco').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('ativa');
    });

    // Mostra a semana selecionada
    const semanaAlvo = document.getElementById(`semana${numero}`);
    if (semanaAlvo) {
        semanaAlvo.style.display = 'block';
        semanaAlvo.classList.add('ativa');
    }

    // Atualiza os botões
    document.querySelectorAll('.btn-semana').forEach(b => b.classList.remove('ativo'));
    event.currentTarget.classList.add('ativo');
}

function abrirPopUp(url) {
    document.getElementById('modal-titulo').innerText = "Mapa Ampliado";
    document.getElementById('modal-corpo').innerHTML = `<img src="${url}" style="width:100%; border-radius:8px;">`;
    document.getElementById('modal-info').style.display = "block";
}

function fecharModal() { document.getElementById('modal-info').style.display = "none"; }

function mostrarGrupo(id, btn) {
    document.querySelectorAll('.secao-grupo').forEach(s => s.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    document.querySelectorAll('.btn-grupo').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
}

function filtrarMapas() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    document.querySelectorAll('.card-mapa').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(termo) ? "block" : "none";
    });
}

window.onload = carregarDados;