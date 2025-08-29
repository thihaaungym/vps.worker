/**
 * Cloudflare Worker – Thailand VPS Proxy Node (GitHub Deploy Ready)
 * Author: ChatGPT
 * VPS Domain: Set via ENV variable VPS_DOMAIN
 * VPS Port: Set via ENV variable VPS_PORT (default 443)
 * Purpose: Forward client requests through Thailand VPS node
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // Original request URL
    const url = new URL(request.url)

    // Use environment variables for flexibility
    const VPS_DOMAIN = VPS_DOMAIN || 'my.994471.xyz'
    const VPS_PORT = VPS_PORT || '443'

    // Construct hostname with port
    url.hostname = VPS_DOMAIN
    url.port = VPS_PORT

    // Create a new request with same method, headers, body
    const newRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
      cf: {
        // Optional Cloudflare features
        cacheEverything: true,
        resolveOverride: VPS_DOMAIN
      }
    })

    // Forward request to VPS
    const response = await fetch(newRequest)

    // Return the VPS response to client
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })

  } catch (err) {
    // Error handling
    return new Response('Worker Error: ' + err.message, { status: 502 })
  }
}
