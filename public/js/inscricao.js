const camposPorCategoria = {
  EXPOSITOR:             ['campos-expositor'],
  CAFEICULTOR:           ['campos-cafeicultor'],
  VISITANTE:             [],
  IMPRENSA:              ['campos-imprensa'],
  COMISSAO_ORGANIZADORA: ['campos-comissao'],
  COLABORADOR:           ['campos-colaborador'],
};

const todosOsCampos = [
  'campos-expositor','campos-cafeicultor','campos-imprensa',
  'campos-comissao','campos-colaborador'
];

// Exibe/oculta campos conforme categoria
document.getElementById('categoria').addEventListener('change', function() {
  const cat = this.value;
  todosOsCampos.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('ativo');
    el.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
  });

  (camposPorCategoria[cat] || []).forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('ativo');
    el.querySelectorAll('input:not([type="hidden"])').forEach(i => i.setAttribute('required', ''));
  });
});

// Calcula CO2 ao preencher cidade+combustivel
let co2Calculado = null;

async function calcularCO2() {
  const cidade = document.getElementById('cidade-origem').value.trim();
  const combustivel = document.getElementById('combustivel').value;
  if (!cidade || !combustivel) return;

  try {
    const resp = await fetch('/api/descarbonizacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cidadeOrigem: cidade, combustivel }),
    });
    const data = await resp.json();
    if (resp.ok) {
      co2Calculado = data;
      const aviso = data.estimativa ? ' (distância estimada — cidade não mapeada)' : '';
      const div = document.getElementById('resultado-co2');
      div.textContent = `🌱 Estimativa: ${data.co2IdaVoltaKg} kg CO₂ (ida e volta, ${data.distanciaKm} km)${aviso}. Equivale a plantar ${data.equivalenteArvores} árvore(s) para compensar.`;
      div.classList.add('show');
    }
  } catch (e) { /* silencioso */ }
}

document.getElementById('cidade-origem').addEventListener('blur', calcularCO2);
document.getElementById('combustivel').addEventListener('change', calcularCO2);

// Submit do formulário
document.getElementById('form-inscricao').addEventListener('submit', async function(e) {
  e.preventDefault();

  const alerta = document.getElementById('alerta');
  alerta.className = 'alert';
  alerta.textContent = '';

  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Aguarde...';
  btn.disabled = true;

  // Coleta dados do form
  const cat = document.getElementById('categoria').value;
  const campos = document.getElementById(`campos-${cat.toLowerCase().replace('_', '-')}`) ||
                 document.getElementById(`campos-${cat.toLowerCase()}`);

  const payload = {
    nome:            document.getElementById('nome').value,
    email:           document.getElementById('email').value,
    telefone:        document.getElementById('telefone').value || undefined,
    categoria:       cat,
    documentoTipo:   document.getElementById('docTipo').value,
    documentoNumero: document.getElementById('docNumero').value,
    aceiteLgpd:      document.getElementById('aceite-lgpd').checked,
  };

  // Campos condicionais
  const addIfExists = (id, key) => {
    const el = document.getElementById(id);
    if (el && el.value.trim()) payload[key] = el.value.trim();
  };

  addIfExists('empresa-exp', 'empresa'); addIfExists('empresa-caf', 'empresa');
  addIfExists('empresa-imp', 'empresa'); addIfExists('empresa-col', 'empresa');
  addIfExists('cargo-exp', 'cargo');     addIfExists('cargo-com', 'cargo');
  addIfExists('cargo-col', 'cargo');
  addIfExists('area-atuacao', 'areaAtuacao');
  addIfExists('nome-veiculo', 'nomeVeiculo');
  addIfExists('numero-registro', 'numeroRegistro');

  const cidadeOrigem = document.getElementById('cidade-origem').value.trim();
  const combustivel  = document.getElementById('combustivel').value;
  if (cidadeOrigem) payload.cidadeOrigem = cidadeOrigem;
  if (combustivel)  payload.combustivel  = combustivel;

  try {
    const resp = await fetch('/api/inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();

    if (!resp.ok) {
      alerta.textContent = data.erro || 'Erro ao realizar credenciamento.';
      alerta.className = 'alert alert-error show';
      btn.textContent = 'Realizar Credenciamento';
      btn.disabled = false;
      return;
    }

    // Sucesso
    document.getElementById('secao-formulario').style.display = 'none';
    document.getElementById('secao-sucesso').style.display = 'block';
    document.getElementById('btn-pdf').href = `/api/credencial/${data.credenciadoId}/pdf`;

    if (data.co2EstimadoKg) {
      const infoDiv = document.getElementById('info-co2');
      infoDiv.textContent = `🌱 Pegada de carbono do seu deslocamento (ida e volta): ${data.co2EstimadoKg} kg CO₂`;
      infoDiv.style.display = 'block';
    }
  } catch (err) {
    alerta.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    alerta.className = 'alert alert-error show';
    btn.textContent = 'Realizar Credenciamento';
    btn.disabled = false;
  }
});
