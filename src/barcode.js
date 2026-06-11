const BWIPJS_CDN  = 'https://cdn.jsdelivr.net/npm/bwip-js@4/dist/bwip-js-min.js';
const ZXING_CDN   = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.18.6/umd/index.min.js';
const PNG_KEYWORD = 'GradLab';
const WORKER_URL  = import.meta.env.VITE_WORKER_URL || 'https://gradlab-params.workers.dev';
const SHORT_ID_RE = /^GL\|[0-9A-Za-z]{6}$/;

function _loadScript(url, globalKey) {
    if (window[globalKey]) return Promise.resolve(window[globalKey]);
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload  = () => window[globalKey] ? resolve(window[globalKey]) : reject(new Error(`${globalKey} not found`));
        s.onerror = () => reject(new Error(`Failed to load ${url}`));
        document.head.appendChild(s);
    });
}

// ── CRC32 (for PNG chunk) ─────────────────────────────────────
const _crcTable = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[i] = c;
    }
    return t;
})();

function _crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = _crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ── PNG tEXt chunk ────────────────────────────────────────────
function _buildTextChunk(keyword, text) {
    const enc  = new TextEncoder();
    const kbuf = enc.encode(keyword);
    const tbuf = enc.encode(text);
    const data = new Uint8Array(kbuf.length + 1 + tbuf.length);
    data.set(kbuf);
    data[kbuf.length] = 0;           // null separator
    data.set(tbuf, kbuf.length + 1);

    const type = new Uint8Array([116, 69, 88, 116]); // 'tEXt'
    const forCrc = new Uint8Array(4 + data.length);
    forCrc.set(type); forCrc.set(data, 4);

    const chunk = new Uint8Array(4 + 4 + data.length + 4);
    const dv = new DataView(chunk.buffer);
    dv.setUint32(0, data.length, false);
    chunk.set(type, 4);
    chunk.set(data, 8);
    dv.setUint32(8 + data.length, _crc32(forCrc), false);
    return chunk;
}

// Injects a tEXt chunk into a PNG data URL, returns a Blob
function _embedTextChunk(dataUrl, keyword, text) {
    const bin = atob(dataUrl.split(',')[1]);
    const src = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) src[i] = bin.charCodeAt(i);

    // Insert after IHDR: PNG sig (8) + IHDR chunk (4+4+13+4 = 25) = offset 33
    const at    = 33;
    const chunk = _buildTextChunk(keyword, text);
    const out   = new Uint8Array(src.length + chunk.length);
    out.set(src.subarray(0, at));
    out.set(chunk, at);
    out.set(src.subarray(at), at + chunk.length);
    return new Blob([out], { type: 'image/png' });
}

// Reads the tEXt chunk matching keyword from a PNG File, returns text or null
async function _readTextChunk(file, keyword) {
    const buf   = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const dv    = new DataView(buf);
    const dec   = new TextDecoder();
    let offset  = 8; // skip PNG signature
    while (offset + 12 <= bytes.length) {
        const len  = dv.getUint32(offset, false);
        const type = dec.decode(bytes.subarray(offset + 4, offset + 8));
        if (type === 'tEXt') {
            const data = dec.decode(bytes.subarray(offset + 8, offset + 8 + len));
            const sep  = data.indexOf('\0');
            if (sep !== -1 && data.substring(0, sep) === keyword) return data.substring(sep + 1);
        }
        if (type === 'IEND') break;
        offset += 4 + 4 + len + 4;
    }
    return null;
}

// ── Public API ────────────────────────────────────────────────

// Stores params JSON in KV via Worker, returns short ID string "GL|xxxxxx".
async function _storeParams(paramsObj) {
    const res = await fetch(`${WORKER_URL}/api/params`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(paramsObj),
    });
    if (!res.ok) throw new Error(`[barcode] Worker error ${res.status}`);
    const { id } = await res.json();
    return `GL|${id}`;
}

// Fetches params JSON from KV via Worker by short ID (without "GL|" prefix).
export async function fetchParamsById(id) {
    const res = await fetch(`${WORKER_URL}/api/params/${id}`);
    if (!res.ok) return null;
    return res.json();
}

// Generates a DataMatrix PNG Blob. paramsObj is the named JSON from exportParamsJson().
// Stores params in Worker KV and encodes only the short ID in the barcode (14×14).
export async function generateBarcodeBlob(paramsObj) {
    const shortId = await _storeParams(paramsObj);
    const bwipjs  = await _loadScript(BWIPJS_CDN, 'bwipjs');
    const canvas  = document.createElement('canvas');
    bwipjs.toCanvas(canvas, { bcid: 'datamatrix', text: shortId, scale: 4 });
    return _embedTextChunk(canvas.toDataURL('image/png'), PNG_KEYWORD, shortId);
}

// Decodes params from a PNG File.
// Priority: tEXt metadata → native BarcodeDetector → ZXing fallback.
export async function decodeBarcode(file) {
    // 1. PNG metadata — reliable on all browsers
    try {
        const text = await _readTextChunk(file, PNG_KEYWORD);
        if (text) return text;
    } catch {}

    // 2. Native BarcodeDetector (Chrome / Edge / Safari 17+)
    if ('BarcodeDetector' in window) {
        try {
            const bitmap = await createImageBitmap(file);
            const det    = new BarcodeDetector({ formats: ['data_matrix'] });
            const codes  = await det.detect(bitmap);
            if (codes.length > 0) return codes[0].rawValue;
        } catch {}
    }

    // 3. ZXing fallback
    try {
        const ZXing = await _loadScript(ZXING_CDN, 'ZXing');
        const reader = new ZXing.BrowserMultiFormatReader();
        const url    = URL.createObjectURL(file);
        try {
            const result = await reader.decodeFromImageUrl(url);
            return result.getText();
        } catch (e) {
            console.warn('[barcode] ZXing decode:', e.message);
        } finally {
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        console.warn('[barcode] ZXing load:', e.message);
    }

    return null;
}
