/**
 * Cloudflare Worker – Thailand VPS Proxy Node (GitHub Deploy Ready)
 * Author: ChatGPT
 * Purpose: Forward client requests through Thailand VPS node
 * Environment Variables:
 *   VPS_DOMAIN = your VPS domain (e.g., my.994471.xyz)
 *   VPS_PORT   = your VPS port (default 443)
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, env) {
  try {
    // Fetch VPS environment variables
    const VPS_DOMAIN = env.VPS_DOMAIN || 'my.994471.xyz';
    const VPS_PORT = env.VPS_PORT || '443';

    // Original request URL
    const url = new URL(request.url);
    url.hostname = VPS_DOMAIN;
    url.port = VPS_PORT;

    // Create a new request to forward to VPS
    const newRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
      cf: {
        // Cloudflare options
        cacheEverything: true,
        resolveOverride: VPS_DOMAIN
      }
    });

    // Forward the request to VPS
    const response = await fetch(newRequest);

    // Return VPS response to client
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });

  } catch (err) {
    // Error handling
    return new Response('Worker Error: ' + err.message, { status: 502 });
  }
}
