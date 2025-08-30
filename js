export default {
  async fetch(request) {
    // VPS Origin (direct server)
    const upstream = "103.76.180.9";   // သင့် VPS IP
    const upstream_port = 443;         // VLESS port
    const upstream_protocol = "https"; // http if no TLS

    // New request to VPS
    const url = new URL(request.url);
    url.hostname = upstream;
    url.port = upstream_port;

    let newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "994471.xyz"); // ✅ သင့် SSL domain

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "manual"
    });

    try {
      const response = await fetch(newRequest);
      return response; // VPS response will return
    } catch (err) {
      return new Response(
        "⚠️ Proxy error → VPS မချိန်မထားသေးပါ\n" + err.toString(),
        { status: 502 }
      );
    }
  }
}
