export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // /api/data 요청만 처리
    if (url.pathname === '/api/data') {
      const GH_TOKEN = env.GH_TOKEN;
      const GH_API = 'https://api.github.com/repos/goeseng/wc2026-bet/contents/data.json';
      const headers = {
        'Authorization': `token ${GH_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'wc2026-bet'
      };
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method === 'GET') {
        const t = url.searchParams.get('t') || Date.now();
        const res = await fetch(`${GH_API}?t=${t}`, { headers });
        const json = await res.json();
        return new Response(JSON.stringify(json), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'PUT') {
        const body = await request.json();
        const res = await fetch(GH_API, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        return new Response(JSON.stringify(json), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // 나머지는 정적 파일 서빙
    return env.ASSETS.fetch(request);
  }
};
