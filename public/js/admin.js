let token = localStorage.getItem('altacafe_token');
let paginaAtual = 1;

const CORES_CATEGORIA = {
  EXPOSITOR:             '#B8860B',
  CAFEICULTOR:           '#6F4E37',
  VISITANTE:             '#2E8B57',
  IMPRENSA:              '#4169E1',
  COMISSAO_ORGANIZADORA: '#8B0000',
  COLABORADOR:           '#696969',
};

// Verifica se já tem token ao carregar
window.addEventListener('load', () => {
  if (token) mostrarPainel();
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alerta = document.getElementById('alerta-login');
  alerta.className = 'alert';

  const email = document.getElementById('email-admin').value;
  const senha = document.getElementById('senha-admin').value;

  try {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await resp.json();

    if (!resp.ok) {
      alerta.textContent = data.erro || 'Credenciais inválidas';
      alerta.className = 'alert alert-error show';
      return;
    }

    token = data.token;
    localStorage.setItem('altacafe_token', token);
    document.getElementById('info-admin').textContent = `Logado como: ${data.nome}`;
    mostrarPainel();
  } catch {
    alerta.textContent = 'Erro de conexão';
    alerta.className = 'alert alert-error show';
  }
});

function mostrarPainel() {
  document.getElementById('secao-login').style.display = 'none';
  document.getElementById('secao-painel').style.display = 'block';
  document.getElementById('btn-logout').style.display = 'inline-block';
  carregarCredenciados(1);
}

function logout() {
  localStorage.removeItem('altacafe_token');
  token = null;
  document.getElementById('secao-login').style.display = 'block';
  document.getElementById('secao-painel').style.display = 'none';
  document.getElementById('btn-logout').style.display = 'none';
}

async function carregarCredenciados(pagina) {
  paginaAtual = pagina;
  const categoria = document.getElementById('filtro-categoria').value;
  const params = new URLSearchParams({ pagina, limite: 20 });
  if (categoria) params.append('categoria', categoria);

  try {
    const resp = await fetch(`/api/admin/credenciados?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.status === 401) { logout(); return; }

    const data = await resp.json();
    renderizarTabela(data.dados);
    renderizarPaginacao(data.total, pagina, 20);
    document.getElementById('info-total').textContent =
      `Total: ${data.total} credenciado(s)`;
  } catch {
    console.error('Erro ao carregar credenciados');
  }
}

function renderizarTabela(dados) {
  const tbody = document.getElementById('tbody-credenciados');
  tbody.innerHTML = '';

  if (!dados.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888">Nenhum credenciado encontrado.</td></tr>';
    return;
  }

  dados.forEach(c => {
    const cor = CORES_CATEGORIA[c.categoria] || '#888';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td><span class="badge" style="background:${cor}">${c.categoriaLabel}</span></td>
      <td style="font-size:.8rem">${c.email}</td>
      <td>${c.empresa || '—'}</td>
      <td style="font-family:monospace;font-size:.8rem">${c.documento}</td>
      <td>${c.co2EstimadoKg ?? '—'}</td>
      <td><a href="/api/credencial/${c.id}/pdf" target="_blank" class="btn btn-secondary" style="padding:.3rem .6rem;font-size:.75rem">PDF</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderizarPaginacao(total, pagina, limite) {
  const totalPaginas = Math.ceil(total / limite);
  const div = document.getElementById('paginacao');
  div.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'btn' + (i === pagina ? '' : ' btn-secondary');
    btn.style.padding = '.4rem .8rem';
    btn.onclick = () => carregarCredenciados(i);
    div.appendChild(btn);
  }
}
