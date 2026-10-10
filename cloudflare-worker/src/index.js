const hopByHop = new Set([
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade'
]);

function originUrl(request, env) {
  const incoming = new URL(request.url);
  const base = new URL(env.ORIGIN_URL);
  base.pathname = incoming.pathname;
  base.search = incoming.search;
  return base;
}

function filteredHeaders(source) {
  const out = new Headers();
  for (const [key, value] of source.entries()) {
    if (!hopByHop.has(key.toLowerCase())) out.set(key, value);
  }
  return out;
}

export default {
  async fetch(request, env) {
    const target = originUrl(request, env);
    const headers = filteredHeaders(request.headers);
    headers.set('X-Forwarded-Host', new URL(request.url).host);
    headers.set('X-Forwarded-Proto', 'https');
    const init = { method: request.method, headers, redirect: 'manual' };
    if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body;
    const response = await fetch(new Request(target, init));
    const output = new Response(response.body, response);
    output.headers.delete('server');
    return output;
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(new URL('/healthz', env.ORIGIN_URL), {
      headers: { 'User-Agent': 'n8n-edge-keepalive/1.0' }
    }));
  }
};
