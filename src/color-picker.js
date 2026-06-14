/**
 * color-picker.js — Custom HSB/HSL/RGB color picker popover
 * Triggered from .color-swatch inside .color-pill
 */

import { sound } from './sound.js';

// ── Color Utils ────────────────────────────────────────────────

function hsbToRgb(h, s, b) {
    s /= 100; b /= 100;
    const k = n => (n + h / 60) % 6;
    const f = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsb(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
    let h = 0;
    if (d) {
        if (max === r)      h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else                h = (r - g) / d + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }
    return [h, max ? Math.round((d / max) * 100) : 0, Math.round(max * 100)];
}

function hsbToHsl(h, s, b) {
    s /= 100; b /= 100;
    const l  = b * (1 - s / 2);
    const sl = (l === 0 || l === 1) ? 0 : (b - l) / Math.min(l, 1 - l);
    return [h, Math.round(sl * 100), Math.round(l * 100)];
}

function hslToHsb(h, sl, l) {
    sl /= 100; l /= 100;
    const bv = l + sl * Math.min(l, 1 - l);
    const sv = bv ? 2 * (1 - l / bv) : 0;
    return [h, Math.round(sv * 100), Math.round(bv * 100)];
}

// ── Channel config per color space ─────────────────────────────

const CHANNELS = {
    hsl: [{ label: 'H', max: 360 }, { label: 'S', max: 100 }, { label: 'L', max: 100 }],
    hsb: [{ label: 'H', max: 360 }, { label: 'S', max: 100 }, { label: 'B', max: 100 }],
    rgb: [{ label: 'R', max: 255 }, { label: 'G', max: 255 }, { label: 'B', max: 255 }],
};

// ── Module state ───────────────────────────────────────────────

let _pop     = null;
let _state   = { h: 0, s: 100, b: 100 };  // internal HSB
let _space   = 'hsl';
let _onChange = null;
let _anchor  = null;

// Assigned during initColorPicker, called from openColorPicker
let _sync         = () => {};
let _updateLabels = () => {};

// ── Canvas Drawing ─────────────────────────────────────────────

function _drawArea(canvas, hue) {
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = canvas;

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, h);

    const wg = ctx.createLinearGradient(0, 0, w, 0);
    wg.addColorStop(0, 'rgba(255,255,255,1)');
    wg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, h, 0, 0);
    bg.addColorStop(0, 'rgba(0,0,0,1)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
}

// ── Build Popover DOM (once) ───────────────────────────────────

function _createPopover() {
    const el = document.createElement('div');
    el.id        = 'cp-popover';
    el.className = 'cp-popover';
    el.innerHTML = `
<div class="cp-area-wrap">
    <div class="cp-area-inner">
        <canvas class="cp-canvas"></canvas>
        <div class="cp-area-hitbox"></div>
    </div>
    <div class="cp-thumb"></div>
</div>
<div class="cp-hue-row">
    <div class="cp-hue-track">
        <div class="cp-hue-thumb"></div>
    </div>
</div>
<div class="control-group control-group--select cp-space-row">
    <label>Space</label>
    <select class="cp-space-select">
        <option value="hsl">HSL</option>
        <option value="hsb">HSB</option>
        <option value="rgb">RGB</option>
    </select>
</div>
<div class="cp-channels">
    <div class="canvas-size-field cp-ch-field">
        <span class="canvas-size-label cp-ch-label">H</span>
        <input type="number" class="cp-ch-input" min="0" max="360" inputmode="numeric">
    </div>
    <div class="canvas-size-field cp-ch-field">
        <span class="canvas-size-label cp-ch-label">S</span>
        <input type="number" class="cp-ch-input" min="0" max="100" inputmode="numeric">
    </div>
    <div class="canvas-size-field cp-ch-field">
        <span class="canvas-size-label cp-ch-label">L</span>
        <input type="number" class="cp-ch-input" min="0" max="100" inputmode="numeric">
    </div>
</div>`;
    document.body.appendChild(el);
    return el;
}

// ── Init ───────────────────────────────────────────────────────

export function initColorPicker() {
    _pop = _createPopover();

    const canvas      = _pop.querySelector('.cp-canvas');
    const hitbox      = _pop.querySelector('.cp-area-hitbox');
    const thumb       = _pop.querySelector('.cp-thumb');
    const hueTrack    = _pop.querySelector('.cp-hue-track');
    const hueThumb    = _pop.querySelector('.cp-hue-thumb');
    const spaceSelect = _pop.querySelector('.cp-space-select');
    const chInputs    = [..._pop.querySelectorAll('.cp-ch-input')];
    const chLabels    = [..._pop.querySelectorAll('.cp-ch-label')];

    // ── Close on outside click or Escape ───────────────────────
    document.addEventListener('pointerdown', (e) => {
        if (_pop.style.display === 'none') return;
        if (!_pop.contains(e.target) && e.target !== _anchor) _hide();
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && _pop.style.display !== 'none') _hide();
    });

    // ── ColorArea drag (hitbox intercepts events above canvas) ────
    let _areaDown = false;
    function _areaUpdate(e) {
        const rect = canvas.getBoundingClientRect();
        _state.s = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
        _state.b = Math.round((1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))) * 100);
        _sync();
    }
    hitbox.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        _areaDown = true;
        hitbox.setPointerCapture(e.pointerId);
        _areaUpdate(e);
    });
    hitbox.addEventListener('pointermove', (e) => { if (_areaDown) _areaUpdate(e); });
    hitbox.addEventListener('pointerup',   () => { _areaDown = false; });
    hitbox.addEventListener('pointercancel', () => { _areaDown = false; });

    // ── Hue drag ──────────────────────────────────────────────
    let _hueDown = false;
    function _hueUpdate(e) {
        const rect = hueTrack.getBoundingClientRect();
        _state.h = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 359);
        _sync();
    }
    hueTrack.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        _hueDown = true;
        hueTrack.setPointerCapture(e.pointerId);
        _hueUpdate(e);
    });
    hueTrack.addEventListener('pointermove', (e) => { if (_hueDown) _hueUpdate(e); });
    hueTrack.addEventListener('pointerup',   () => { _hueDown = false; });
    hueTrack.addEventListener('pointercancel', () => { _hueDown = false; });

    // ── Color space selector ───────────────────────────────────
    spaceSelect.addEventListener('change', () => {
        sound.select();
        _space = spaceSelect.value;
        _updateLabels();
        _fillInputs();
    });

    // ── Channel number inputs ──────────────────────────────────
    chInputs.forEach(inp => {
        inp.addEventListener('focus', () => sound.tap());
        inp.addEventListener('change', () => {
            const vals = chInputs.map(i => parseInt(i.value) || 0);
            if (_space === 'hsl') {
                const [nh, ns, nb] = hslToHsb(vals[0], vals[1], vals[2]);
                _state = { h: nh, s: ns, b: nb };
            } else if (_space === 'hsb') {
                _state = { h: vals[0], s: vals[1], b: vals[2] };
            } else {
                const [nh, ns, nb] = rgbToHsb(vals[0], vals[1], vals[2]);
                _state = { h: nh, s: ns, b: nb };
            }
            _sync();
        });
    });

    // ── Internal helpers ───────────────────────────────────────

    function _fillInputs() {
        let vals;
        if (_space === 'hsl')      vals = hsbToHsl(_state.h, _state.s, _state.b);
        else if (_space === 'hsb') vals = [_state.h, _state.s, _state.b];
        else                       vals = hsbToRgb(_state.h, _state.s, _state.b);
        chInputs.forEach((inp, i) => { if (document.activeElement !== inp) inp.value = vals[i]; });
    }

    _updateLabels = () => {
        const cfg = CHANNELS[_space];
        chLabels.forEach((lbl, i) => { lbl.textContent = cfg[i].label; });
        chInputs.forEach((inp, i) => { inp.max = cfg[i].max; });
    };

    _sync = () => {
        if (canvas.width > 0 && canvas.height > 0) _drawArea(canvas, _state.h);

        // Area thumb — visual position clamped 7px (half thumb) inside edges
        thumb.style.left = `calc(7px + (100% - 14px) * ${_state.s / 100})`;
        thumb.style.top  = `calc(7px + (100% - 14px) * ${(100 - _state.b) / 100})`;
        const [tr, tg, tb]     = hsbToRgb(_state.h, _state.s, _state.b);
        const hex              = rgbToHex(tr, tg, tb);
        thumb.style.background = hex;

        // Hue thumb
        hueThumb.style.left       = `${(_state.h / 359) * 100}%`;
        hueThumb.style.background = rgbToHex(...hsbToRgb(_state.h, 100, 100));

        _fillInputs();

        if (_onChange) _onChange(hex);
    };
}

// ── Public API ─────────────────────────────────────────────────

export function openColorPicker(swatchEl, hex, onChangeFn) {
    if (!_pop) return;

    // Toggle if clicking the same swatch while open
    if (_anchor === swatchEl && _pop.style.display !== 'none') {
        _hide();
        return;
    }

    _anchor   = swatchEl;
    _onChange = onChangeFn;

    const [r, g, b]   = hexToRgb(hex);
    const [h, s, bv]  = rgbToHsb(r, g, b);
    _state = { h, s, b: bv };

    _pop.querySelector('.cp-space-select').value = _space;

    // Show offscreen first to allow layout measurement
    _pop.style.left    = '-9999px';
    _pop.style.top     = '-9999px';
    _pop.style.display = 'flex';

    requestAnimationFrame(() => {
        // Set canvas drawing buffer to match CSS size
        const canvas   = _pop.querySelector('.cp-canvas');
        canvas.width   = canvas.offsetWidth;
        canvas.height  = canvas.offsetHeight;

        _updateLabels();
        _sync();

        // Position near anchor
        const rect = swatchEl.getBoundingClientRect();
        const pw   = _pop.offsetWidth;
        const ph   = _pop.offsetHeight;
        const vw   = window.innerWidth;
        const vh   = window.innerHeight;

        let left = rect.left;
        let top  = rect.bottom + 8;
        if (top + ph > vh - 8)  top  = rect.top - ph - 8;
        if (left + pw > vw - 8) left = vw - pw - 8;
        if (left < 8)           left = 8;

        _pop.style.left = `${left}px`;
        _pop.style.top  = `${top}px`;
    });

    sound.open();
}

function _hide() {
    if (!_pop || _pop.style.display === 'none') return;
    _pop.style.display = 'none';
    _anchor = null;
    sound.close();
}

export { _hide as closeColorPicker };
