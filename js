/**
 * Cloudflare Worker – Thailand VPS Proxy Node
 * Author: ChatGPT
 * Purpose: Forward client requests through Thailand VPS node
 * Usage: Set VPS_DOMAIN and VPS_PORT in Worker environment variables
 */

export default {
  async fetch(request, env) {
    try {
      // Original request URL
      const url = new URL(request.url);

      // Access environment variables
      const VPS_DOMAIN = env.VPS_DOMAIN || 'my.994471.xyz';
      const VPS_PORT = env.VPS_PORT || '443';

      // Assign VPS hostname and port
      url.hostname = VPS_DOMAIN;
      url.port = VPS_PORT;

      // Create a new request to forward
      const newRequest = new Request(url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
        cf: {
          // Optional: Cloudflare features
          cacheEverything: true,
          resolveOverride: VPS_DOMAIN
        }
      });

      // Forward request to VPS
      const response = await fetch(newRequest);

      // Return VPS response to client
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

    } catch (err) {
      return new Response('Worker Error: ' + err.message, { status: 502 });
    }
  }
}
