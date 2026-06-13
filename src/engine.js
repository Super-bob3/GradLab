/**
 * engine.js — WebGL Engine & Render Loop
 * Handles WebGL context, shader compilation, uniform updates, and the animation loop.
 */

import { VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC } from './shaders.js';
import { renderMatrix } from './matrix.js';

// ── Module State ──────────────────────────────────────────────
let gl = null;
let program = null;
let locs = {};
let _refHeight = 0;
let bgTextureObj = null;
export let hasBgTextureFlag = false;
export let bgTextureDataURLStored = '';

export let currentColors = [];
export const MAX_COLORS = 8;

let cameraX = 0.0;
let cameraY = 0.0;
let isDraggingCanvas = false;
let startMouseX = 0, startMouseY = 0;
let startCameraX = 0, startCameraY = 0;

export let noiseCanvas = null;

// Recording
export let isRecording = false;
export let capturedFrames = [];
export let recordSeconds = 0;
let recordTimer = null;

// Render loop pause (used during video encoding)
let _renderPaused = false;
let _renderArgs = null;
export function pauseRendering()  { _renderPaused = true; }
export function resumeRendering() {
    if (!_renderPaused) return;
    _renderPaused = false;
    if (_renderArgs) requestAnimationFrame((t) => render(t, ..._renderArgs));
}

// ── Shader Compilation ────────────────────────────────────────
function createShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        console.error('SHADER COMPILE ERROR:', info);
        document.body.innerHTML += `<div style="position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;font-family:monospace;white-space:pre-wrap;">${info}</div>`;
    }
    return shader;
}

// ── Noise Overlay Canvas ──────────────────────────────────────
function createSharpNoiseCanvas(size) {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 255;
        imgData.data[i] = val; imgData.data[i+1] = val;
        imgData.data[i+2] = val; imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    return c;
}

// ── Engine Init ───────────────────────────────────────────────
export function initEngine(canvasEl, noiseOverlayEl, containerEl, cardEl, getColors) {
    gl = canvasEl.getContext('webgl', { preserveDrawingBuffer: true })
        || canvasEl.getContext('experimental-webgl', { preserveDrawingBuffer: true });

    if (!gl) {
        alert('WebGL not supported in this browser.');
        return;
    }

    // Compile and link program
    program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttr);

    // Blank texture
    bgTextureObj = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, bgTextureObj);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,255]));

    // Uniform locations
    locs = {
        res:        gl.getUniformLocation(program, 'u_resolution'),
        time:       gl.getUniformLocation(program, 'u_time'),
        colors:     gl.getUniformLocation(program, 'u_colors'),
        count:      gl.getUniformLocation(program, 'u_colorCount'),
        type:       gl.getUniformLocation(program, 'u_flow_type'),
        zoom:       gl.getUniformLocation(program, 'u_zoom'),
        pan:        gl.getUniformLocation(program, 'u_pan'),
        flow:       gl.getUniformLocation(program, 'u_flow_speed'),
        liquid:     gl.getUniformLocation(program, 'u_liquid_str'),
        morph:      gl.getUniformLocation(program, 'u_morph'),
        rotation:   gl.getUniformLocation(program, 'u_rotation'),
        artEnable:  gl.getUniformLocation(program, 'u_enable_art'),
        artType:    gl.getUniformLocation(program, 'u_art_type'),
        artSize:    gl.getUniformLocation(program, 'u_art_size'),
        artShape:   gl.getUniformLocation(program, 'u_art_shape'),
        artContrast:gl.getUniformLocation(program, 'u_art_contrast'),
        bgTexture:  gl.getUniformLocation(program, 'u_bg_texture'),
        hasBgTexture: gl.getUniformLocation(program, 'u_has_bg_texture'),
        colorMode:  gl.getUniformLocation(program, 'u_color_mode'),
        blendBias:  gl.getUniformLocation(program, 'u_blend_bias'),
        blendSharp: gl.getUniformLocation(program, 'u_blend_sharp'),
        refHeight:  gl.getUniformLocation(program, 'u_ref_height'),
    };

    // Noise grain — driven by canvas, not CSS overlay
    noiseCanvas = document.getElementById('noise-canvas');

    // Resize
    function resize() {
        // Math.max(2, ...) 保底 2x：Windows DPR=1 也需要与 Mac Retina 输出一致的渲染分辨率，不要改成纯 devicePixelRatio
        const dpr = Math.max(2, window.devicePixelRatio || 1);
        canvasEl.width  = canvasEl.clientWidth  * dpr;
        canvasEl.height = canvasEl.clientHeight * dpr;
        if (!_refHeight) _refHeight = canvasEl.height;
        gl.viewport(0, 0, canvasEl.width, canvasEl.height);
        noiseCanvas.width  = canvasEl.width;
        noiseCanvas.height = canvasEl.height;
        // Let matrix.js know about resize
        if (window._onEngineResize) window._onEngineResize();
    }
    window.addEventListener('resize', resize);
    resize();

    // Input: pan and tilt
    _setupInput(containerEl, cardEl, canvasEl);

    // Start loop
    _renderArgs = [canvasEl, noiseOverlayEl, getColors];
    requestAnimationFrame((t) => render(t, canvasEl, noiseOverlayEl, getColors));
}

// ── Background Texture Upload ─────────────────────────────────
export function uploadBgTexture(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, bgTextureObj);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            hasBgTextureFlag = true;
            bgTextureDataURLStored = event.target.result;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// ── Render Loop ───────────────────────────────────────────────
function render(time, canvasEl, noiseOverlayEl, getColors) {
    time *= 0.001;

    const colors = getColors();

    gl.uniform2f(locs.res, canvasEl.width, canvasEl.height);
    gl.uniform1f(locs.refHeight, _refHeight || canvasEl.height);
    gl.uniform1f(locs.time, time);
    gl.uniform1i(locs.count, colors.length);

    const colorData = new Float32Array(MAX_COLORS * 3);
    colors.forEach((hex, i) => {
        colorData[i*3]   = parseInt(hex.slice(1,3), 16) / 255;
        colorData[i*3+1] = parseInt(hex.slice(3,5), 16) / 255;
        colorData[i*3+2] = parseInt(hex.slice(5,7), 16) / 255;
    });
    gl.uniform3fv(locs.colors, colorData);

    gl.uniform1f(locs.type,    parseFloat(_ctrl('type').value));
    gl.uniform1f(locs.zoom,    parseFloat(_ctrl('zoom').value) * 0.028 + 0.2);
    gl.uniform2f(locs.pan,     cameraX, cameraY);
    gl.uniform1f(locs.flow,    parseFloat(_ctrl('speed').value) * 0.02);
    gl.uniform1f(locs.liquid,  parseFloat(_ctrl('liquid').value) * 0.02);
    gl.uniform1f(locs.morph,   parseFloat(_ctrl('morph').value) / 100.0 * 3.0);
    gl.uniform1f(locs.rotation, parseFloat(_ctrl('rotation').value) * (Math.PI / 180.0));

    gl.uniform1i(locs.artEnable,   _ctrl('art-enable').checked ? 1 : 0);
    gl.uniform1f(locs.artType,     parseFloat(_ctrl('art-type').value));
    gl.uniform1f(locs.artSize,     parseFloat(_ctrl('art-size').value));
    gl.uniform1f(locs.artShape,    parseFloat(_ctrl('art-shape').value));
    gl.uniform1f(locs.artContrast, parseFloat(_ctrl('art-contrast').value));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bgTextureObj);
    gl.uniform1i(locs.bgTexture,    0);
    gl.uniform1i(locs.hasBgTexture, hasBgTextureFlag ? 1 : 0);

    gl.uniform1i(locs.colorMode,  _ctrl('color-mode').checked ? 1 : 0);
    gl.uniform1f(locs.blendBias,  parseFloat(_ctrl('blend-bias').value) / 100.0);
    gl.uniform1f(locs.blendSharp, parseFloat(_ctrl('blend-sharp').value) / 100.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // ASCII Matrix
    renderMatrix(canvasEl, time);

    // Grain noise — draw to noise-canvas every frame
    _renderGrain();

    // Recording frame capture
    if (isRecording) {
        _captureFrame(canvasEl);
    }

    if (!_renderPaused) requestAnimationFrame((t) => render(t, canvasEl, noiseOverlayEl, getColors));
}

// Shared tiled noise pattern (generated once, reused every frame)
let _noiseTile = null;
function _getOrCreateNoiseTile() {
    if (_noiseTile) return _noiseTile;
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    _noiseTile = c;
    return c;
}

function _renderGrain() {
    const grainVal = parseFloat(_ctrl('grain').value) / 100.0;
    const nCtx = noiseCanvas.getContext('2d');
    nCtx.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height);
    if (grainVal <= 0) {
        noiseCanvas.style.opacity = 0;
        return;
    }
    const tile = _getOrCreateNoiseTile();
    const pattern = nCtx.createPattern(tile, 'repeat');
    nCtx.fillStyle = pattern;
    nCtx.fillRect(0, 0, noiseCanvas.width, noiseCanvas.height);
    noiseCanvas.style.mixBlendMode = _ctrl('grain-blend').value;
    noiseCanvas.style.opacity = grainVal * 0.6;
}

function _captureFrame(canvasEl) {
    const textCanvas = document.getElementById('text-canvas');
    const asciiEnabled = _ctrl('ascii-enable').checked;
    const compCanvas = document.createElement('canvas');
    compCanvas.width  = canvasEl.width;
    compCanvas.height = canvasEl.height;
    const compCtx = compCanvas.getContext('2d');
    compCtx.drawImage(canvasEl, 0, 0);
    if (asciiEnabled) {
        compCtx.globalCompositeOperation = _ctrl('ascii-blend').value;
        compCtx.drawImage(textCanvas, 0, 0);
        compCtx.globalCompositeOperation = 'source-over';
    }
    const grainVal = parseFloat(_ctrl('grain').value) / 100.0;
    if (grainVal > 0) {
        compCtx.globalCompositeOperation = _ctrl('grain-blend').value;
        compCtx.globalAlpha = grainVal * 0.6;
        compCtx.drawImage(noiseCanvas, 0, 0);   // reuse same frame's noise
        compCtx.globalCompositeOperation = 'source-over';
        compCtx.globalAlpha = 1;
    }
    createImageBitmap(compCanvas).then(bmp => capturedFrames.push(bmp));
}

// ── Camera / Input ────────────────────────────────────────────
function _setupInput(containerEl, cardEl, canvasEl) {
    const hud = document.getElementById('panHud');
    let hudFadeTimer = null;

    function showHud() {
        if (!hud) return;
        hud.textContent = `X ${cameraX.toFixed(3)}   Y ${cameraY.toFixed(3)}`;
        hud.classList.add('visible');
        clearTimeout(hudFadeTimer);
        hudFadeTimer = setTimeout(() => hud.classList.remove('visible'), 1200);
    }

    function startPan(clientX, clientY) {
        isDraggingCanvas = true;
        startMouseX = clientX; startMouseY = clientY;
        startCameraX = cameraX; startCameraY = cameraY;
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    function movePan(clientX, clientY) {
        if (!isDraggingCanvas) return;
        const deltaX = clientX - startMouseX;
        const deltaY = clientY - startMouseY;
        const aspect = canvasEl.clientWidth / canvasEl.clientHeight;
        const normX = (deltaX / canvasEl.clientWidth) * aspect;
        const normY = deltaY / canvasEl.clientHeight;
        const currentZoom = parseFloat(_ctrl('zoom').value) * 0.028 + 0.2;
        cameraX = startCameraX - normX / currentZoom;
        cameraY = startCameraY + normY / currentZoom;
        showHud();
    }

    const CARD_TRANSITION = 'transform 0.1s ease-out, border-radius 0.2s ease, box-shadow 0.3s ease';

    containerEl.addEventListener('mousedown',  (e) => startPan(e.clientX, e.clientY));
    containerEl.addEventListener('touchstart', (e) => startPan(e.touches[0].clientX, e.touches[0].clientY), { passive: false });

    window.addEventListener('mouseup', () => {
        if (isDraggingCanvas) {
            isDraggingCanvas = false;
            cardEl.style.transition = CARD_TRANSITION;
        }
    });
    window.addEventListener('touchend', () => {
        isDraggingCanvas = false;
        cardEl.style.transition = CARD_TRANSITION;
    });

    containerEl.addEventListener('mousemove', (e) => {
        if (isDraggingCanvas) movePan(e.clientX, e.clientY);
    });

    containerEl.addEventListener('touchmove', (e) => {
        if (isDraggingCanvas) { e.preventDefault(); movePan(e.touches[0].clientX, e.touches[0].clientY); }
    }, { passive: false });

    containerEl.addEventListener('wheel', (e) => {
        e.preventDefault();
        let val = parseFloat(_ctrl('zoom').value);
        val -= e.deltaY * 0.1;
        syncSlider('zoom', val);
        showHud();
    }, { passive: false });

    containerEl.addEventListener('dblclick', () => {
        cameraX = 0.0; cameraY = 0.0;
        syncSlider('zoom', 36);
        showHud();
    });
}

// ── Recording ─────────────────────────────────────────────────
export function startRecording() {
    capturedFrames = [];
    recordSeconds = 0;
    isRecording = true;
    recordTimer = setInterval(() => { recordSeconds++; }, 1000);
}

export function stopRecording() {
    clearInterval(recordTimer);
    isRecording = false;
}

export function getRecordSeconds() { return recordSeconds; }

export function pickMime() {
    const types = ['video/mp4; codecs=avc1.42E01E','video/mp4','video/webm; codecs=vp9','video/webm; codecs=vp8','video/webm'];
    for (const t of types) { if (MediaRecorder.isTypeSupported(t)) return t; }
    return '';
}

// ── Helpers ───────────────────────────────────────────────────
function _ctrl(id) {
    return document.getElementById('ctrl-' + id);
}

export function syncSlider(id, val) {
    const max = parseFloat(document.getElementById('ctrl-' + id).max || 100);
    const min = parseFloat(document.getElementById('ctrl-' + id).min || 0);
    val = Math.max(min, Math.min(max, val));
    document.getElementById('ctrl-' + id).value = val;
    const valEl = document.getElementById('val-' + id);
    if (valEl) valEl.innerText = Math.round(val);
}

export function getGl() { return gl; }
export function getCameraPos() { return { x: cameraX, y: cameraY }; }
export function resetCamera() { cameraX = 0; cameraY = 0; }
export function setCameraPos(x, y) { cameraX = x; cameraY = y; }

// Generate sharp noise at exact target resolution — avoids scaling/interpolation artifacts
export function _buildFullNoise(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c;
}
