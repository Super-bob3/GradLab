const RATE_LIMIT   = 20;
const RATE_WINDOW  = 3600;
const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const ALLOWED = ['https://gradlab.app', 'https://www.gradlab.app'];

function corsHeaders(origin) {
    const ok = ALLOWED.includes(origin) || /^https?:\/\/localhost/.test(origin);
    return {
        'Access-Control-Allow-Origin':  ok ? origin : ALLOWED[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
    };
}

function randomId() {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => B62[b % 62]).join('');
}

async function contentHash(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf).slice(0, 8)).map(b => B62[b % 62]).join('');
}

export default {
    async fetch(req, env) {
        const url    = new URL(req.url);
        const origin = req.headers.get('Origin') || '';
        const cors   = corsHeaders(origin);

        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }

        // GET /api/params/:id
        if (req.method === 'GET' && url.pathname.startsWith('/api/params/')) {
            const id   = url.pathname.slice('/api/params/'.length).trim();
            if (!id)   return new Response('Not found', { status: 404, headers: cors });
            const data = await env.KV.get(`p:${id}`, 'json');
            if (!data) return new Response('Not found', { status: 404, headers: cors });
            return Response.json(data, { headers: cors });
        }

        // POST /api/params
        if (req.method === 'POST' && url.pathname === '/api/params') {
            let body;
            try { body = await req.json(); }
            catch { return new Response('Invalid JSON', { status: 400, headers: cors }); }

            const ip        = req.headers.get('CF-Connecting-IP') || 'unknown';
            const canonical = JSON.stringify(body, Object.keys(body).sort());
            const hash      = await contentHash(canonical);

            // Rate limit + dedup checks in parallel
            const [rlRaw, existingId] = await Promise.all([
                env.KV.get(`rl:${ip}`),
                env.KV.get(`h:${hash}`),
            ]);

            const count = rlRaw ? parseInt(rlRaw) : 0;
            if (count >= RATE_LIMIT) {
                return new Response('Rate limit exceeded', {
                    status: 429,
                    headers: { ...cors, 'Retry-After': String(RATE_WINDOW) },
                });
            }

            // Increment counter regardless (dedup or new)
            await env.KV.put(`rl:${ip}`, String(count + 1), { expirationTtl: RATE_WINDOW });

            if (existingId) {
                return Response.json({ id: existingId }, { headers: cors });
            }

            // Generate collision-free ID
            let id;
            for (let i = 0; i < 10; i++) {
                id = randomId();
                if (!(await env.KV.get(`p:${id}`))) break;
            }

            await Promise.all([
                env.KV.put(`p:${id}`, canonical),
                env.KV.put(`h:${hash}`, id),
            ]);

            return Response.json({ id }, { status: 201, headers: cors });
        }

        return new Response('Not found', { status: 404, headers: cors });
    },
};
