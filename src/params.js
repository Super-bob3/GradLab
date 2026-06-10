import { currentColors } from './controls.js';
import { applyStateObject } from './controls.js';

// Index tables for select fields (value → index, index → value)
const GRAIN_BLEND   = ['overlay','screen','soft-light','color-dodge','color-burn','luminosity'];
const ASCII_DITHER  = ['none','bayer','fs','atkinson'];
const ASCII_BLEND   = ['source-over','screen','overlay','color-dodge','lighter'];
const ASCII_CHARSET = ['code','standard','blocks','detailed','minimal','binary','custom'];

function _i(arr, val) { const i = arr.indexOf(val); return i >= 0 ? i : 0; }
function _v(arr, i)   { return arr[+i] ?? arr[0]; }

// ── Export ────────────────────────────────────────────────────
// Compact pipe-delimited format: GL|colors|...34 fields total
// Example: GL|FB7C47,E1B8FF|1|65|0|11|18|25|25|69|80|20|0|0|3|5.3|0|30|1|1|0|14|1|14|FFFFFF|0|20|50|60|0|0||0|0
export function exportParams() {
    function r(id)  { const el = document.getElementById('ctrl-' + id); return el ? el.value   : ''; }
    function rb(id) { const el = document.getElementById('ctrl-' + id); return el ? (el.checked ? 1 : 0) : 0; }

    const panX = window._getCameraPos ? window._getCameraPos().x : 0;
    const panY = window._getCameraPos ? window._getCameraPos().y : 0;

    return [
        'GL',
        currentColors.map(h => h.replace('#', '')).join(','),
        rb('color-mode'),
        r('blend-bias'),
        r('blend-sharp'),
        r('type'),
        r('zoom'),
        r('speed'),
        r('liquid'),
        r('morph'),
        r('rotation'),
        r('grain'),
        _i(GRAIN_BLEND,   r('grain-blend')),
        rb('art-enable'),
        r('art-type'),
        r('art-size'),
        r('art-shape'),
        r('art-contrast'),
        rb('ascii-enable'),
        r('ascii-mode'),
        _i(ASCII_DITHER,  r('ascii-dither')),
        r('ascii-size'),
        r('ascii-spacing'),
        r('ascii-font'),
        (r('ascii-color') || '#000000').replace('#', ''),
        _i(ASCII_BLEND,   r('ascii-blend')),
        r('ascii-decay'),
        r('ascii-radius'),
        r('ascii-smooth'),
        r('ascii-gravity'),
        _i(ASCII_CHARSET, r('ascii-charset')),
        encodeURIComponent(r('ascii-custom') || ''),
        panX,
        panY,
    ].join('|');
}

// ── Import ────────────────────────────────────────────────────
export function importParams(str) {
    if (typeof str !== 'string') return false;

    // Current GL pipe format
    if (str.startsWith('GL|')) {
        const f = str.split('|');
        if (f.length < 34) return false;
        applyStateObject({
            colors:      f[1].split(',').map(h => '#' + h),
            colorMode:   f[2] === '1',
            blendBias:   f[3],
            blendSharp:  f[4],
            type:        f[5],
            zoom:        f[6],
            speed:       f[7],
            liquid:      f[8],
            morph:       f[9],
            rotation:    f[10],
            grain:       f[11],
            grainBlend:  _v(GRAIN_BLEND,   f[12]),
            artEnable:   f[13] === '1',
            artType:     f[14],
            artSize:     f[15],
            artShape:    f[16],
            artContrast: f[17],
            asciiEnable:  f[18] === '1',
            asciiMode:    f[19],
            asciiDither:  _v(ASCII_DITHER,  f[20]),
            asciiSize:    f[21],
            asciiSpacing: f[22],
            asciiFont:    f[23],
            asciiColor:   '#' + f[24],
            asciiBlend:   _v(ASCII_BLEND,   f[25]),
            asciiDecay:   f[26],
            asciiRadius:  f[27],
            asciiSmooth:  f[28],
            asciiGravity: f[29],
            asciiCharset: _v(ASCII_CHARSET, f[30]),
            asciiCustom:  decodeURIComponent(f[31] || ''),
            panX: parseFloat(f[32]) || 0,
            panY: parseFloat(f[33]) || 0,
        });
        return true;
    }

    // Legacy JSON fallback (v1 / v2)
    try {
        const p = JSON.parse(str);
        if (!p?.v) return false;
        if (p.v === 1) { applyStateObject(p); return true; }
        if (p.v === 2) {
            applyStateObject({
                colors:      p.c.map(h => '#' + h),
                colorMode:   !!p.cm,   blendBias: p.bb,    blendSharp:  p.bs,
                type:        p.t,      zoom:      p.z,     speed:       p.sp,
                liquid:      p.lq,     morph:     p.mo,    rotation:    p.ro,
                grain:       p.gr,     grainBlend: p.gb,
                artEnable:   !!p.ae,   artType:   p.at,    artSize:     p.as,
                artShape:    p.ah,     artContrast: p.ac,
                asciiEnable: !!p.xe,   asciiMode: p.xm,    asciiDither: p.xd,
                asciiSize:   p.xz,     asciiSpacing: p.xp, asciiFont:   p.xf,
                asciiColor:  '#' + p.xc, asciiBlend: p.xl,
                asciiDecay:  p.xk,     asciiRadius: p.xr,  asciiSmooth: p.xs,
                asciiGravity: p.xg,    asciiCharset: p.xh, asciiCustom: p.xu,
                panX: p.px || 0,       panY: p.py || 0,
            });
            return true;
        }
    } catch { /* not JSON */ }

    return false;
}
