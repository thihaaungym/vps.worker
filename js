export default {
  async fetch(request) {
    // === VPS Origin (direct server) ===
    const upstream = "103.76.180.9";   // သင့် VPS IP
    const upstream_port = 443;         // VLESS server port
    const upstream_protocol = "https"; // http or https

    // === Rewrite client request ===
    const url = new URL(request.url);
    url.hostname = upstream;
    url.port = upstream_port;

    // headers copy
    let newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "my.994471.xyz"); // SNI/Host (domain)

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "manual"
    });

    // === Fetch from VPS through Cloudflare ===
    return fetch(newRequest);
  }
};
