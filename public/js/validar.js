let stream = null;
let animFrameId = null;
let ultimoQr = null;
let bloqueado = false;

const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

async function iniciarCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    video.setAttribute('playsinline', true);
    await video.play();

    document.getElementById('btn-iniciar').style.display = 'none';
    document.getElementById('btn-parar').style.display = 'inline-block';

    requestAnimationFrame(scanLoop);
  } catch (err) {
    mostrarResultado('Não foi possível acessar a câmera: ' + err.message, false);
  }
}

function pararCamera() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
  document.getElementById('btn-iniciar').style.display = 'inline-block';
  document.getElementById('btn-parar').style.display = 'none';
}

function scanLoop() {
  animFrameId = requestAnimationFrame(scanLoop);
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

  canvas.height = video.videoHeight;
  canvas.width  = video.videoWidth;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

  if (code && code.data && code.data !== ultimoQr && !bloqueado) {
    ultimoQr = code.data;
    validarQrCode(code.data);
  }
}

async function validarQrCode(qrData) {
  bloqueado = true;

  try {
    const resp = await fetch('/api/validar-acesso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCodeData: qrData }),
    });
    const data = await resp.json();
    const liberado = data.resultado === 'Acesso Liberado';

    mostrarResultado(data.resultado, liberado);
    adicionarHistorico(qrData, data.resultado, liberado);
  } catch {
    mostrarResultado('Erro de conexão', false);
  }

  // Desbloqueia depois de 3s para permitir próxima leitura
  setTimeout(() => { bloqueado = false; ultimoQr = null; }, 3000);
}

async function validarManual() {
  const id = document.getElementById('input-manual').value.trim();
  if (!id) return;
  await validarQrCode(id);
  document.getElementById('input-manual').value = '';
}

function mostrarResultado(texto, liberado) {
  const div = document.getElementById('resultado');
  div.style.display = 'block';
  div.textContent = liberado ? '✅ ' + texto : '❌ ' + texto;
  div.className = 'qr-result ' + (liberado ? 'liberado' : 'negado');
}

function adicionarHistorico(id, resultado, liberado) {
  const tbody = document.getElementById('historico');
  const tr = document.createElement('tr');
  const hora = new Date().toLocaleTimeString('pt-BR');
  const idCurto = id.length > 16 ? id.substring(0, 16) + '…' : id;
  const cor = liberado ? '#2E8B57' : '#C0392B';
  tr.innerHTML = `<td>${hora}</td><td style="font-size:.75rem;font-family:monospace">${idCurto}</td>
    <td><span class="badge" style="background:${cor}">${resultado}</span></td>`;
  tbody.insertBefore(tr, tbody.firstChild);
}
