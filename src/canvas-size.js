/**
 * canvas-size.js — Canvas dimension control & scale-to-fit preview
 */

import { sound } from './sound.js';

const PRESETS = [
    { w: 640, h: 360 },  // 16:9
    { w: 480, h: 480 },  // 1:1
];

const AREA_PAD = 48;

let _triggeringEngineResize = false;

function _recalcScale(w, h) {
    const container = document.getElementById('cardContainer');
    const area      = document.querySelector('.canvas-area');
    if (!container || !area) return;

    const aw = area.clientWidth  - AREA_PAD;
    const ah = area.clientHeight - AREA_PAD;
    const scale = Math.min(1, aw / w, ah / h);

    container.style.transform = `scale(${scale})`;

    // Compensate the layout space so flex centering works correctly
    const mh = Math.round((w * (1 - scale)) / 2);
    const mv = Math.round((h * (1 - scale)) / 2);
    container.style.margin = `-${mv}px -${mh}px`;
}

function _applySize(w, h) {
    const container = document.getElementById('cardContainer');
    if (!container) return;

    container.style.width  = w + 'px';
    container.style.height = h + 'px';
    _recalcScale(w, h);

    // Trigger engine resize() without re-entering our own handler
    _triggeringEngineResize = true;
    window.dispatchEvent(new Event('resize'));
    _triggeringEngineResize = false;
}

function _updatePresetActive(w, h) {
    document.querySelectorAll('.canvas-preset-btn').forEach(btn => {
        const match = parseInt(btn.dataset.w) === w && parseInt(btn.dataset.h) === h;
        btn.classList.toggle('active', match);
    });
}

export function initCanvasSize() {
    const inputW      = document.getElementById('ctrl-canvas-w');
    const inputH      = document.getElementById('ctrl-canvas-h');
    const presetBtns  = document.querySelectorAll('.canvas-preset-btn');

    // Preset clicks
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sound.select();
            const w = parseInt(btn.dataset.w);
            const h = parseInt(btn.dataset.h);
            inputW.value = w;
            inputH.value = h;
            _updatePresetActive(w, h);
            _applySize(w, h);
        });
    });

    const MIN_W = 100, MAX_W = 3840;
    const MIN_H = 100, MAX_H = 2160;

    // Manual input — debounced during typing, clamped on commit
    let _debounce;
    function onInput() {
        clearTimeout(_debounce);
        _debounce = setTimeout(() => {
            const rawW = parseInt(inputW.value);
            const rawH = parseInt(inputH.value);
            // Only apply to canvas if both values are already in valid range.
            // Don't write back to the input — let the user finish typing first.
            if (rawW >= MIN_W && rawH >= MIN_H) {
                const w = Math.min(MAX_W, rawW);
                const h = Math.min(MAX_H, rawH);
                _updatePresetActive(w, h);
                _applySize(w, h);
            }
        }, 600);
    }
    function onCommit() {
        clearTimeout(_debounce);
        const w = Math.max(MIN_W, Math.min(MAX_W, parseInt(inputW.value) || 640));
        const h = Math.max(MIN_H, Math.min(MAX_H, parseInt(inputH.value) || 360));
        inputW.value = w;
        inputH.value = h;
        _updatePresetActive(w, h);
        _applySize(w, h);
    }
    inputW.addEventListener('input', onInput);
    inputH.addEventListener('input', onInput);
    inputW.addEventListener('blur', onCommit);
    inputH.addEventListener('blur', onCommit);
    inputW.addEventListener('keydown', e => { if (e.key === 'Enter') inputW.blur(); });
    inputH.addEventListener('keydown', e => { if (e.key === 'Enter') inputH.blur(); });

    // Re-scale on viewport resize (don't re-trigger engine resize)
    window.addEventListener('resize', () => {
        if (_triggeringEngineResize) return;
        const w = parseInt(inputW.value) || 640;
        const h = parseInt(inputH.value) || 360;
        _recalcScale(w, h);
    });

    // Apply default
    _applySize(640, 360);
}
