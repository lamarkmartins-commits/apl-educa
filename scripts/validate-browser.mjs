// Verificação local sem dependências extras. Executar com ng serve ativo:
// node scripts/validate-browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { setTimeout as pause } from 'node:timers/promises';

const base = new URL(process.argv[2] ?? 'http://localhost:4200');
assert(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Use somente servidor local.');
const profile = await mkdtemp(join(tmpdir(), 'apl-educa-quality-'));
const executable =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const chrome = spawn(
  executable,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true },
);
let launchError;
chrome.on('error', (error) => {
  launchError = error;
});
let socket;
let browserSocket;
let browserCommand;
const calls = new Map();
let seq = 0;
const runtimeErrors = [];
const externalRequests = [];

function connect(url) {
  return new Promise((accept, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => accept(ws), { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}
function commandSocket(ws) {
  ws.addEventListener('message', ({ data }) => {
    const item = JSON.parse(data);
    if (item.id && calls.has(item.id)) {
      const { accept, reject, timer } = calls.get(item.id);
      clearTimeout(timer);
      calls.delete(item.id);
      item.error ? reject(new Error(JSON.stringify(item.error))) : accept(item.result);
    }
    if (item.method === 'Runtime.exceptionThrown')
      runtimeErrors.push(item.params.exceptionDetails.text);
    if (item.method === 'Network.requestWillBeSent') {
      const url = item.params.request.url;
      if (/^https?:/.test(url) && new URL(url).origin !== base.origin) externalRequests.push(url);
    }
  });
  return (method, params = {}) =>
    new Promise((accept, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => {
        calls.delete(id);
        reject(new Error(`Timeout: ${method}`));
      }, 15000);
      calls.set(id, { accept, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
}

try {
  let port;
  let browserPath;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (launchError) throw launchError;
    try {
      [port, browserPath] = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8'))
        .trim()
        .split(/\r?\n/);
      break;
    } catch {
      await pause(100);
    }
  }
  assert(port, 'Chrome não iniciou. Confira CHROME_PATH.');
  browserSocket = await connect(`ws://127.0.0.1:${port}${browserPath}`);
  browserCommand = commandSocket(browserSocket);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = await connect(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  const send = commandSocket(socket);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const wait = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return;
      await pause(100);
    }
    throw new Error(`Condição não atingida: ${expression}`);
  };
  const navigate = async (path) => {
    await send('Page.navigate', { url: new URL(path, base).href });
    await wait(
      `location.pathname === ${JSON.stringify(path.split('?')[0])} && !!document.querySelector('h1') && !!window.ng`,
    );
    await pause(150);
  };
  const clickText = async (text) => {
    assert(
      await evaluate(
        `(()=>{const el=[...document.querySelectorAll('button')].find(el=>el.textContent.includes(${JSON.stringify(text)}));el?.click();return !!el})()`,
      ),
      text,
    );
    await pause(150);
  };
  const routes = [
    '/',
    '/como-visitar',
    '/materiais-educativos',
    '/preparar-oficio',
    '/solicitar-visita',
    '/acompanhar-solicitacao',
    '/admin',
    '/pagina-inexistente',
  ];
  for (const width of [320, 390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const path of routes) {
      await navigate(path);
      if (path === '/materiais-educativos') {
        await evaluate("document.querySelectorAll('details').forEach(el => el.open = true)");
        assert(
          await evaluate(
            "Array.from(document.querySelectorAll('.card-body')).every(el => el.scrollWidth <= el.clientWidth + 1)",
          ),
          `Guias abertos em ${width}px não devem ter texto cortado.`,
        );
      }
      const metrics = await evaluate(`({h1:document.querySelectorAll('h1').length,
        width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})`);
      if (metrics.scroll > metrics.width + 1) {
        console.log(
          await evaluate(
            `Array.from(document.querySelectorAll('main *')).filter(el=>el.getBoundingClientRect().right>document.documentElement.clientWidth+1).slice(-8).map(el=>({tag:el.tagName,class:el.className,text:el.textContent.trim().slice(0,120)}))`,
          ),
        );
      }
      assert.equal(metrics.h1, 1, `${path}: h1`);
      assert(
        metrics.scroll <= metrics.width + 1,
        `${path} em ${width}px: transbordamento ${JSON.stringify(metrics)}`,
      );
    }
    console.log(`Responsividade: oito rotas em ${width}px sem transbordamento da página.`);
  }
  await navigate('/materiais-educativos');
  await evaluate("document.querySelector('summary').focus()");
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
    text: '\r',
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
  });
  await wait("document.querySelector('details').open");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  assert(
    await evaluate(
      'document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1',
    ),
    'Guia aberto não deve transbordar no celular.',
  );
  await evaluate("document.querySelector('.menu-toggle').click()");
  await wait("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'");
  await evaluate("document.querySelector('#navegacao-principal a').focus()");
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await wait(
    "document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false' && document.activeElement === document.querySelector('.menu-toggle')",
  );
  await evaluate('document.querySelector(\'.next-step a[href="/preparar-oficio"]\').click()');
  await wait(
    "location.pathname === '/preparar-oficio' && document.activeElement?.id === 'conteudo'",
  );
  console.log('Teclado: leitura com Enter e foco no conteúdo após navegação.');

  await navigate('/solicitar-visita');
  await clickText('Preencher com exemplo');
  for (let step = 0; step < 3; step++) {
    await evaluate("document.querySelector('form').requestSubmit()");
    await pause(150);
  }
  await evaluate("document.querySelector('#demo-consent').click()");
  await clickText('Salvar demonstração local');
  await wait("!!document.querySelector('.local-code')");
  const code = await evaluate("document.querySelector('.local-code').textContent.trim()");
  await navigate(`/acompanhar-solicitacao?codigo=${encodeURIComponent(code)}`);
  await wait("!!document.querySelector('app-demo-record-details')");
  await navigate('/admin');
  await wait("!!document.querySelector('tbody button')");
  await clickText('Ver detalhes');
  await evaluate(
    "(()=>{const el=document.querySelector('#next-status'); el.value='em_analise_demo';el.dispatchEvent(new Event('change',{bubbles:true}));})()",
  );
  await clickText('Salvar status de simulação');
  await evaluate(
    "(()=>{const el=document.querySelector('#admin-observation');el.value='Observação fictícia da validação técnica.';el.dispatchEvent(new Event('input',{bubbles:true}));})()",
  );
  await clickText('Salvar observação local');
  await navigate(`/acompanhar-solicitacao?codigo=${encodeURIComponent(code)}`);
  await wait(
    "document.querySelector('app-demo-record-details')?.textContent.includes('Observação fictícia da validação técnica.')",
  );
  assert(
    await evaluate(
      "document.querySelector('app-demo-record-details').textContent.includes('Em análise')",
    ),
  );
  assert.deepEqual(runtimeErrors, [], 'Erros de execução no navegador.');
  assert.deepEqual(externalRequests, [], 'Requisições externas inesperadas.');
  console.log(
    'Fluxo completo: criar → consultar → alterar status e observação → recarregar e consultar.',
  );
  console.log('Nenhum erro de execução ou requisição HTTP externa durante os testes.');
} finally {
  if (browserCommand) await browserCommand('Browser.close').catch(() => {});
  socket?.close();
  browserSocket?.close();
  if (chrome.exitCode === null)
    await Promise.race([new Promise((accept) => chrome.once('exit', accept)), pause(3000)]);
  if (chrome.exitCode === null) chrome.kill();
  // Só excluir o perfil efêmero criado por este script; nunca o perfil normal do usuário.
  assert.equal(dirname(resolve(profile)), resolve(tmpdir()));
  assert(basename(profile).startsWith('apl-educa-quality-'));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}
