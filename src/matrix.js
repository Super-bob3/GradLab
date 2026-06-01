/**
 * matrix.js — Interactive ASCII Character Matrix
 * Stage 5: renders an animated character grid over the shader canvas.
 */

// ── State ─────────────────────────────────────────────────────
let cells = [];
let textCanvas = null;
let textCtx = null;

export let asciiGridCols = 0;
export let asciiWrapDist = 0;
export let asciiPadTop   = 0;
export let asciiPadBot   = 0;
export let asciiErrBuf   = [];

const textMouse = { x: -1000, y: -1000, hover: false, radius: 240 };
let targetMouseX = -1000, targetMouseY = -1000;
let lastMouseX   = -1000, lastMouseY   = -1000;

const CHARSETS = {
    standard: '@%#*+=-:. ',
    blocks:   '██▓▒░ ',
    detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\'"^`. ',
    minimal:  '·■ ',
    binary:   '01',
};

let codeSnippet = "import{Antigravity}from'@core';const_engine=newAntigravity.Engine();if(mouse.hover){applyForce(mouse.radius);}";
for (let j = 0; j < 3; j++) { codeSnippet += codeSnippet; }

// ── Init ──────────────────────────────────────────────────────
export function initMatrixCanvas(glCanvas, containerEl) {
    textCanvas = document.getElementById('text-canvas');
    textCtx    = textCanvas.getContext('2d');

    // Sync size with WebGL canvas
    function syncSize() {
        textCanvas.width  = glCanvas.width;
        textCanvas.height = glCanvas.height;
        initMatrix();
    }

    // Hook resize from engine
    window._onEngineResize = syncSize;
    syncSize();

    // Mouse tracking
    containerEl.addEventListener('pointerenter', () => { textMouse.hover = true; });
    containerEl.addEventListener('pointerleave', () => {
        textMouse.hover = false;
        targetMouseX = textMouse.x = -1000;
        targetMouseY = textMouse.y = -1000;
        lastMouseX   = -1000;
        lastMouseY   = -1000;
    });
    containerEl.addEventListener('pointermove', (e) => {
        const rect = textCanvas.getBoundingClientRect();
        targetMouseX = (e.clientX - rect.left)  * (textCanvas.width  / rect.width);
        targetMouseY = (e.clientY - rect.top)    * (textCanvas.height / rect.height);
    });
}

// ── Build Cell Grid ───────────────────────────────────────────
export function initMatrix() {
    if (!textCanvas) return;
    cells = [];
    const asciiSizeSlider = parseFloat(_ctrl('ascii-size').value);
    const asciiSpacing    = parseFloat(_ctrl('ascii-spacing').value);
    const charsetType     = _ctrl('ascii-charset').value;
    const customText      = _ctrl('ascii-custom').value;

    let charSequence = '';
    if (charsetType === 'code')        charSequence = codeSnippet;
    else if (charsetType === 'custom') charSequence = customText || ' ';
    else                               charSequence = CHARSETS[charsetType] || CHARSETS.standard;

    if (!charSequence || charSequence.length === 0) charSequence = ' ';

    const cellSize  = asciiSizeSlider;
    const spacing   = cellSize * asciiSpacing;
    const padCols   = 4;
    const padRows   = 20;
    const cols      = Math.floor(textCanvas.width  / spacing) + 1;
    const rows      = Math.floor(textCanvas.height / spacing) + 1;

    asciiGridCols = cols + padCols * 2;
    asciiWrapDist = (rows + padRows * 2) * spacing;
    asciiPadTop   = -padRows * spacing;
    asciiPadBot   = textCanvas.height + padRows * spacing;
    asciiErrBuf   = new Float32Array(asciiGridCols * (rows + padRows * 2));

    let charIdx = 0;
    for (let y = -padRows; y < rows + padRows; y++) {
        for (let x = -padCols; x < cols + padCols; x++) {
            cells.push({
                x:  x * spacing + spacing / 2,
                y:  y * spacing + spacing / 2,
                ox: x * spacing + spacing / 2,
                oy: y * spacing + spacing / 2,
                vx: 0, vy: 0, heat: 0,
                baseChar: charSequence[charIdx % charSequence.length],
            });
            charIdx++;
        }
    }
}

// ── Render (called each frame) ────────────────────────────────
export function renderMatrix(glCanvas, time) {
    if (!textCanvas) return;
    const asciiEnabled = _ctrl('ascii-enable').checked;

    if (!asciiEnabled) {
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textCanvas.style.mixBlendMode = 'normal';
        return;
    }

    // Smooth mouse — snap instantly on first entry to avoid sweeping heat trail
    const smoothVal   = parseFloat(_ctrl('ascii-smooth').value) / 100.0;
    const lerpFactor  = 1.0 - smoothVal;
    if (targetMouseX !== -1000 && targetMouseY !== -1000) {
        if (textMouse.x === -1000) {
            textMouse.x = targetMouseX;
            textMouse.y = targetMouseY;
        } else {
            textMouse.x += (targetMouseX - textMouse.x) * lerpFactor;
            textMouse.y += (targetMouseY - textMouse.y) * lerpFactor;
        }
    } else {
        textMouse.x = -1000;
        textMouse.y = -1000;
    }

    // Speed-based heat injection — stationary mouse injects no heat
    let heatInjection = 0;
    if (lastMouseX !== -1000) {
        const mdx = textMouse.x - lastMouseX;
        const mdy = textMouse.y - lastMouseY;
        heatInjection = Math.min(1.0, Math.sqrt(mdx * mdx + mdy * mdy) * 0.1);
    }
    lastMouseX = textMouse.x;
    lastMouseY = textMouse.y;

    const asciiMode      = _ctrl('ascii-mode').value;
    const asciiFont      = parseFloat(_ctrl('ascii-font').value);
    const blendMode      = _ctrl('ascii-blend').value;
    const baseColorHex   = _ctrl('ascii-color').value;
    const ditherType     = _ctrl('ascii-dither') ? _ctrl('ascii-dither').value : 'none';
    const thermalDecayVal = parseFloat(_ctrl('ascii-decay').value) / 1000.0;
    const gravityVal     = parseFloat(_ctrl('ascii-gravity').value) / 10.0;
    const fieldRadius    = parseFloat(_ctrl('ascii-radius').value);
    textMouse.radius     = fieldRadius;

    // Build active charset — match original: code→3-char array, others→reversed array
    const charsetType = _ctrl('ascii-charset').value;
    const customText  = _ctrl('ascii-custom').value;
    let activeAnimSet;
    if (charsetType === 'code') {
        activeAnimSet = ['-', '>', 'o'];
    } else if (charsetType === 'custom') {
        activeAnimSet = (customText || ' ').split('').reverse();
    } else {
        activeAnimSet = (CHARSETS[charsetType] || CHARSETS.standard).split('').reverse();
    }

    // Base color from hex
    const cr = parseInt(baseColorHex.slice(1,3), 16);
    const cg = parseInt(baseColorHex.slice(3,5), 16);
    const cb = parseInt(baseColorHex.slice(5,7), 16);

    // Apply CSS blend mode on the canvas element (not textCtx compositeOperation)
    let cssBlend = blendMode;
    if (blendMode === 'source-over') cssBlend = 'normal';
    else if (blendMode === 'lighter') cssBlend = 'plus-lighter';
    textCanvas.style.mixBlendMode = cssBlend;

    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    textCtx.globalCompositeOperation = 'source-over';
    textCtx.font = `bold ${asciiFont}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    textCtx.textAlign    = 'center';
    textCtx.textBaseline = 'middle';

    // Gravity — scroll cell origins, wrap when they leave bounds
    if (gravityVal !== 0.0) {
        cells.forEach(cell => {
            cell.oy += gravityVal;
            if (gravityVal > 0 && cell.oy > asciiPadBot) {
                cell.oy -= asciiWrapDist;
                cell.y = cell.oy;
            } else if (gravityVal < 0 && cell.oy < asciiPadTop) {
                cell.oy += asciiWrapDist;
                cell.y = cell.oy;
            }
        });
    }

    const N = activeAnimSet.length - 1;

    if (asciiMode === '0') {
        // Dynamic background mode
        _renderDynamicMode(glCanvas, activeAnimSet, N, cr, cg, cb, ditherType, time);
    } else {
        // Heatmap decay mode
        _renderHeatmapMode(activeAnimSet, N, cr, cg, cb, heatInjection, thermalDecayVal);
    }
}

function _renderDynamicMode(glCanvas, activeAnimSet, N, cr, cg, cb, ditherType, time) {
    // Sample GL canvas at reduced resolution for performance (matches original 128x128)
    if (!_renderDynamicMode._sampler) {
        _renderDynamicMode._sampler = document.createElement('canvas');
        _renderDynamicMode._sampler.width  = 128;
        _renderDynamicMode._sampler.height = 128;
        _renderDynamicMode._samplerCtx = _renderDynamicMode._sampler.getContext('2d', { willReadFrequently: true });
    }
    _renderDynamicMode._samplerCtx.drawImage(glCanvas, 0, 0, 128, 128);
    const lumaData = _renderDynamicMode._samplerCtx.getImageData(0, 0, 128, 128).data;

    const colStride = asciiGridCols;
    if (ditherType !== 'none') asciiErrBuf.fill(0);

    cells.forEach((cell, i) => {
        // Use gravity-scrolled origin for sampling
        cell.x = cell.ox;
        cell.y = cell.oy;

        const normX = Math.max(0, Math.min(0.999, cell.x / textCanvas.width));
        const normY = Math.max(0, Math.min(0.999, cell.y / textCanvas.height));
        const px  = Math.floor(normX * 128);
        const py  = Math.floor(normY * 128);
        const idx = (py * 128 + px) * 4;
        const lum = (lumaData[idx] * 0.299 + lumaData[idx+1] * 0.587 + lumaData[idx+2] * 0.114) / 255.0;

        let wave = lum * activeAnimSet.length;

        if (ditherType === 'none') {
            let charIdx = N - Math.max(0, Math.min(N, Math.round(wave)));
            if (charIdx >= 0) {
                textCtx.fillStyle = `rgba(${cr},${cg},${cb},1.0)`;
                textCtx.fillText(activeAnimSet[charIdx], cell.x, cell.y);
            }
        } else if (ditherType === 'bayer') {
            const bayer4x4 = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
            const threshold = (bayer4x4[(Math.floor(i / colStride) % 4) * 4 + ((i % colStride) % 4)] + 0.5) / 16.0;
            wave += (threshold - 0.5);
            let charIdx = N - Math.max(0, Math.min(N, Math.round(wave)));
            if (charIdx >= 0) {
                textCtx.fillStyle = `rgba(${cr},${cg},${cb},1.0)`;
                textCtx.fillText(activeAnimSet[charIdx], cell.x, cell.y);
            }
        } else if (ditherType === 'fs') {
            wave += asciiErrBuf[i];
            let quant = Math.max(0, Math.min(N, Math.round(wave)));
            let err = wave - quant;
            const x = i % colStride;
            if (x < colStride - 1 && i + 1 < cells.length)                     asciiErrBuf[i + 1]               += err * 0.4375;
            if (i + colStride < cells.length) {
                if (x > 0)                                                        asciiErrBuf[i + colStride - 1]   += err * 0.1875;
                asciiErrBuf[i + colStride]                                       += err * 0.3125;
                if (x < colStride - 1 && i + colStride + 1 < cells.length)       asciiErrBuf[i + colStride + 1]   += err * 0.0625;
            }
            let charIdx = N - quant;
            if (charIdx >= 0) {
                textCtx.fillStyle = `rgba(${cr},${cg},${cb},1.0)`;
                textCtx.fillText(activeAnimSet[charIdx], cell.x, cell.y);
            }
        } else if (ditherType === 'atkinson') {
            wave += asciiErrBuf[i];
            let quant = Math.max(0, Math.min(N, Math.round(wave)));
            let err = wave - quant;
            const x = i % colStride;
            const eighth = err * 0.125;
            if (x < colStride - 1 && i + 1 < cells.length)                       asciiErrBuf[i + 1]               += eighth;
            if (x < colStride - 2 && i + 2 < cells.length)                       asciiErrBuf[i + 2]               += eighth;
            if (i + colStride < cells.length) {
                if (x > 0)                                                         asciiErrBuf[i + colStride - 1]   += eighth;
                asciiErrBuf[i + colStride]                                        += eighth;
                if (x < colStride - 1 && i + colStride + 1 < cells.length)        asciiErrBuf[i + colStride + 1]   += eighth;
            }
            if (i + colStride * 2 < cells.length) asciiErrBuf[i + colStride * 2] += eighth;
            let charIdx = N - quant;
            if (charIdx >= 0) {
                textCtx.fillStyle = `rgba(${cr},${cg},${cb},1.0)`;
                textCtx.fillText(activeAnimSet[charIdx], cell.x, cell.y);
            }
        }
    });
}

function _renderHeatmapMode(activeAnimSet, N, cr, cg, cb, heatInjection, thermalDecayVal) {
    cells.forEach((cell) => {
        const dist = Math.hypot(cell.x - textMouse.x, cell.y - textMouse.y);
        if (textMouse.hover && dist < textMouse.radius) {
            const heatUp = (1.0 - dist / textMouse.radius) * heatInjection;
            cell.heat = Math.min(1.0, cell.heat + heatUp);
        }
        cell.heat = Math.max(0.0, cell.heat - thermalDecayVal);

        // Spring back toward gravity-scrolled origin
        cell.x += (cell.ox - cell.x) * 0.2;
        cell.y += (cell.oy - cell.y) * 0.2;

        if (cell.heat > 0.01) {
            const charIdxForm = Math.floor(cell.heat * 0.999 * activeAnimSet.length);
            textCtx.fillStyle = `rgba(${cr},${cg},${cb},1.0)`;
            textCtx.fillText(activeAnimSet[charIdxForm], cell.x, cell.y);
        }
    });
}

// ── Helpers ───────────────────────────────────────────────────
function _ctrl(id) { return document.getElementById('ctrl-' + id); }
