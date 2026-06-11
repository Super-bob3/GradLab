/**
 * export.js — Screenshot, Video Recording, and Code Export
 */

import {
    isRecording, capturedFrames, hasBgTextureFlag, bgTextureDataURLStored,
    startRecording, stopRecording, getRecordSeconds, pickMime,
    _buildFullNoise, pauseRendering, resumeRendering,
} from './engine.js';
import { VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC } from './shaders.js';
import { sound } from './sound.js';
import { exportParamsJson } from './params.js';
import { generateBarcodeBlob } from './barcode.js';

export let isChinese = false;
export function setIsChinese(val) { isChinese = val; }

// ── Analytics snapshot ────────────────────────────────────────
function _trackParams(getCurrentColors) {
    const c = (id) => document.getElementById('ctrl-' + id);
    return {
        flow_type:        parseInt(c('type').value),
        ascii_enabled:    c('ascii-enable').checked,
        halftone_enabled: c('art-enable').checked,
        color_count:      getCurrentColors().length,
        grain:            parseInt(c('grain').value),
        ascii_charset:    c('ascii-enable').checked ? c('ascii-charset').value : undefined,
    };
}

// ── Screenshot ────────────────────────────────────────────────
export function initDownload(glCanvas, getCurrentColors) {
    document.getElementById('btn-download').addEventListener('click', () => {
        sound.confirm();
        const btn = document.getElementById('btn-download');
        btn.innerText = 'PROCESSING...';

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width  = glCanvas.width;
        tempCanvas.height = glCanvas.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(glCanvas, 0, 0);

        if (document.getElementById('ctrl-ascii-enable').checked) {
            const textCanvas = document.getElementById('text-canvas');
            ctx.globalCompositeOperation = document.getElementById('ctrl-ascii-blend').value;
            ctx.drawImage(textCanvas, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
        }

        const noiseCanvasEl = document.getElementById('noise-canvas');
        const grainVal = parseFloat(document.getElementById('ctrl-grain').value) / 100.0;
        if (grainVal > 0 && noiseCanvasEl) {
            ctx.globalCompositeOperation = document.getElementById('ctrl-grain-blend').value;
            ctx.globalAlpha = grainVal * 0.6;
            ctx.drawImage(noiseCanvasEl, 0, 0);
        }

        const link = document.createElement('a');
        link.href     = tempCanvas.toDataURL('image/png', 1.0);
        link.download = `pipeline-shader-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        btn.innerText = 'DOWNLOAD FRAME';
        if (typeof umami !== 'undefined') umami.track('download_image', _trackParams(getCurrentColors));
    });
}

// ── Video Recording ───────────────────────────────────────────
export function initRecording(glCanvas, getCurrentColors) {
    const btn = document.getElementById('btn-record');

    btn.addEventListener('click', () => {
        if (_getIsRecording()) {
            sound.recordStop();
            stopRecording();
            btn.classList.remove('btn-record-active');
            btn.innerHTML = isChinese ? '<i class="ri-record-circle-line"></i> 录制视频' : '<i class="ri-record-circle-line"></i> Record MP4';
            _encodeAndDownload(glCanvas, btn);
        } else {
            sound.recordStart();
            startRecording();
            btn.classList.add('btn-record-active');
            btn.innerHTML = '<i class="ri-stop-circle-line"></i> Stop (0s)';
            const timer = setInterval(() => {
                if (!_getIsRecording()) { clearInterval(timer); return; }
                btn.innerHTML = `<i class="ri-stop-circle-line"></i> Stop (${getRecordSeconds()}s)`;
            }, 1000);
        }
    });
}

function _getIsRecording() {
    return isRecording;
}

function _encodeAndDownload(glCanvas, btn) {
    const mimeType = pickMime();
    const ext      = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const pingpong = document.getElementById('ctrl-pingpong').checked;

    // Downsample captured frames to 30fps based on actual recording rate
    const rawFrames = [...capturedFrames];
    if (rawFrames.length === 0) return;
    const captureFPS = rawFrames.length / Math.max(getRecordSeconds(), 0.1);
    const keepEvery  = Math.max(1, Math.round(captureFPS / 30));
    const sampled    = rawFrames.filter((_, i) => i % keepEvery === 0);

    const allFrames = pingpong
        ? sampled.concat(sampled.slice(0, -1).reverse())
        : sampled;

    if (allFrames.length === 0) return;

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = glCanvas.width;
    tmpCanvas.height = glCanvas.height;
    const tmpCtx = tmpCanvas.getContext('2d');
    const stream  = tmpCanvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 40_000_000 });
    const chunks  = [];

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        _downloadBlob(blob, ext);
        sound.complete();
        if (typeof umami !== 'undefined') umami.track('download_video', { format: ext, duration: getRecordSeconds(), pingpong, ..._trackParams(getCurrentColors) });
        btn.innerHTML = isChinese ? '<i class="ri-record-circle-line"></i> 录制视频' : '<i class="ri-record-circle-line"></i> Record MP4';
        allFrames.forEach(bmp => { if (bmp.close) bmp.close(); });
    };

    pauseRendering();
    recorder.start();
    let i = 0;
    const total = allFrames.length;
    const FPS_INTERVAL = 1000 / 30;

    function drawNext() {
        if (i >= total) {
            recorder.stop();
            resumeRendering();
            return;
        }
        tmpCtx.drawImage(allFrames[i], 0, 0);
        i++;
        const pct = Math.round((i / total) * 100);
        btn.innerHTML = isChinese ? `<i class="ri-loader-4-line"></i> 编码中 ${pct}%` : `<i class="ri-loader-4-line"></i> Encoding ${pct}%`;
        setTimeout(drawNext, FPS_INTERVAL);
    }
    drawNext();
}

function _downloadBlob(blob, ext) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = `pipeline-shader-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ── Code Export ───────────────────────────────────────────────
export function initCodeExport(getCurrentColors) {
    document.getElementById('btn-export-code').addEventListener('click', () => {
        sound.open();
        const params = _gatherParams(getCurrentColors);
        const code   = _buildExportCode(params);
        document.getElementById('code-output').value = code;
        document.getElementById('code-modal').style.display = 'flex';
    });

    document.getElementById('btn-copy-code').addEventListener('click', () => {
        sound.confirm();
        const btn = document.getElementById('btn-copy-code');
        navigator.clipboard.writeText(document.getElementById('code-output').value).then(() => {
            if (typeof umami !== 'undefined') umami.track('copy_code', _trackParams(getCurrentColors));
            btn.innerHTML = isChinese ? '<i class="ri-check-line"></i> 已复制' : '<i class="ri-check-line"></i> Copied';
            setTimeout(() => { btn.innerHTML = isChinese ? '<i class="ri-file-copy-line"></i> 复制代码' : '<i class="ri-file-copy-line"></i> Copy Code'; }, 2000);
        });
    });

    document.getElementById('btn-download-code').addEventListener('click', () => {
        sound.confirm();
        const btn  = document.getElementById('btn-download-code');
        const code = document.getElementById('code-output').value;
        const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
        _downloadBlob(blob, 'html');
        if (typeof umami !== 'undefined') umami.track('download_code', _trackParams(getCurrentColors));
        btn.innerHTML = isChinese ? '<i class="ri-check-line"></i> 已下载！' : '<i class="ri-check-line"></i> Downloaded!';
        setTimeout(() => { btn.innerHTML = isChinese ? '<i class="ri-download-2-line"></i> 下载代码' : '<i class="ri-download-2-line"></i> Download'; }, 2000);
    });

    const closeCode = () => { sound.close(); document.getElementById('code-modal').style.display = 'none'; };
    document.getElementById('btn-close-code').addEventListener('click', closeCode);
    document.getElementById('btn-close-code2').addEventListener('click', async () => {
        sound.tap();
        try {
            const blob = await generateBarcodeBlob(exportParamsJson());
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.download = 'gradlab-params.png';
            a.href     = url;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            console.error('[barcode] generate failed:', e);
        }
    });
    document.getElementById('code-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('code-modal')) closeCode();
    });
}

function _ctrl(id) { return document.getElementById('ctrl-' + id); }

function _gatherParams(getCurrentColors) {
    return {
        colors:      JSON.stringify(getCurrentColors()),
        flowType:    _ctrl('type').value,
        zoom:        _ctrl('zoom').value,
        speed:       _ctrl('speed').value,
        liquid:      _ctrl('liquid').value,
        morph:       _ctrl('morph').value,
        rotation:    _ctrl('rotation').value,
        artEnable:   _ctrl('art-enable').checked,
        artType:     _ctrl('art-type').value,
        artSize:     _ctrl('art-size').value,
        artShape:    _ctrl('art-shape').value,
        artContrast: _ctrl('art-contrast').value,
        grain:       _ctrl('grain').value,
        grainBlend:  _ctrl('grain-blend').value,
        colorMode:   _ctrl('color-mode').checked ? 1 : 0,
        blendBias:   _ctrl('blend-bias').value,
        blendSharp:  _ctrl('blend-sharp').value,
        panX:        window._getCameraPos ? window._getCameraPos().x : 0,
        panY:        window._getCameraPos ? window._getCameraPos().y : 0,
        hasBgTexture: hasBgTextureFlag,
        asciiEnable: _ctrl('ascii-enable').checked,
        asciiMode:   _ctrl('ascii-mode').value,
        asciiDither: _ctrl('ascii-dither') ? _ctrl('ascii-dither').value : 'none',
        asciiSize:   _ctrl('ascii-size').value,
        asciiSpacing:_ctrl('ascii-spacing').value,
        asciiFont:   _ctrl('ascii-font').value,
        asciiColor:  _ctrl('ascii-color').value,
        asciiBlend:  _ctrl('ascii-blend').value,
        asciiDecay:  _ctrl('ascii-decay').value,
        asciiRadius: _ctrl('ascii-radius').value,
        asciiSmooth: _ctrl('ascii-smooth').value,
        asciiGravity:_ctrl('ascii-gravity').value,
        asciiCharset:_ctrl('ascii-charset').value,
        asciiCustom: _ctrl('ascii-custom').value,
    };
}

function _buildExportCode(params) {
    const vertSrc = VERTEX_SHADER_SRC;
    const fragSrc = FRAGMENT_SHADER_SRC;
    const bgTextureDataURL = bgTextureDataURLStored;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pipeline Shader — Exported</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
  canvas { display: block; width: 100%; height: 100%; }
  #text-canvas { position: absolute; top: 0; left: 0; z-index: 5; pointer-events: none; }
  .noise-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-size: 128px 128px; pointer-events: none; z-index: 10;
    mix-blend-mode: ${params.grainBlend}; opacity: ${params.grain / 100.0 * 0.6};
  }
</style>
</head>
<body>
<div style="position:relative; width:100%; height:100%;">
<canvas id="glCanvas"></canvas>
<canvas id="text-canvas"></canvas>
<div class="noise-overlay" id="noiseOverlay"></div>
</div>
<script id="vertex-shader" type="x-shader/x-vertex">${vertSrc}<\/script>
<script id="fragment-shader" type="x-shader/x-fragment">${fragSrc}<\/script>
<script>
(function() {
  const COLORS = ${params.colors};
  const FLOW_TYPE = ${params.flowType};
  const ZOOM = ${params.zoom} * 0.028 + 0.2;
  const FLOW_SPEED = ${params.speed} * 0.02;
  const LIQUID_STR = ${params.liquid} * 0.02;
  const MORPH = ${params.morph} / 100.0 * 3.0;
  const ROTATION = ${params.rotation} * (Math.PI / 180.0);
  const ART_ENABLE = ${params.artEnable ? 1 : 0};
  const ART_TYPE = ${params.artType};
  const ART_SIZE = ${params.artSize};
  const ART_SHAPE = ${params.artShape};
  const ART_CONTRAST = ${params.artContrast};
  const ART_ASCII_ENABLE = ${params.asciiEnable};
  const ART_ASCII_MODE = '${params.asciiMode}';
  const ART_ASCII_SIZE = ${params.asciiSize};
  const ART_ASCII_SPACING = ${params.asciiSpacing};
  const ART_ASCII_FONT = ${params.asciiFont};
  const ART_ASCII_COLOR = '${params.asciiColor}';
  const ART_ASCII_BLEND = '${params.asciiBlend}';
  const ART_ASCII_DECAY = ${params.asciiDecay} / 1000.0;
  const ART_ASCII_RADIUS = ${params.asciiRadius};
  const ART_ASCII_SMOOTH = ${params.asciiSmooth} / 100.0;
  const ART_ASCII_GRAVITY = ${params.asciiGravity} / 10.0;
  const ART_ASCII_CHARSET = '${params.asciiCharset}';
  const ART_ASCII_CUSTOM = \`${params.asciiCustom.replace(/`/g, '\\`')}\`;
  const ART_ASCII_DITHER = '${params.asciiDither}';
  const GRAIN = ${params.grain};

  if (GRAIN > 0) {
    const nc = document.createElement('canvas'); nc.width = 256; nc.height = 256;
    const nctx = nc.getContext('2d');
    const img = nctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 255;
    }
    nctx.putImageData(img, 0, 0);
    document.getElementById('noiseOverlay').style.backgroundImage = 'url(' + nc.toDataURL() + ')';
  }

  const canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl.VERTEX_SHADER, document.getElementById('vertex-shader').textContent));
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, document.getElementById('fragment-shader').textContent));
  gl.linkProgram(program); gl.useProgram(program);

  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(pos);

  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,255]));
  let HAS_BG = ${params.hasBgTexture ? 1 : 0};
  ${params.hasBgTexture ? `
  (function() {
    const bgImg = new Image();
    bgImg.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImg);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    };
    bgImg.src = '${bgTextureDataURL}';
  })();` : ''}

  const loc = (n) => gl.getUniformLocation(program, n);
  function resize() {
    // Math.max(2, ...) 保底 2x：Windows DPR=1 也需要与 Mac Retina 输出一致的渲染分辨率，不要改成纯 devicePixelRatio
    const dpr = Math.max(2, window.devicePixelRatio || 1);
    canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize); resize();

  function render(time) {
    time *= 0.001;
    gl.uniform2f(loc('u_resolution'), canvas.width, canvas.height);
    gl.uniform1f(loc('u_time'), time);
    gl.uniform1i(loc('u_colorCount'), COLORS.length);
    const cd = new Float32Array(8 * 3);
    COLORS.forEach((hex, i) => {
      cd[i*3]   = parseInt(hex.slice(1,3),16)/255;
      cd[i*3+1] = parseInt(hex.slice(3,5),16)/255;
      cd[i*3+2] = parseInt(hex.slice(5,7),16)/255;
    });
    gl.uniform3fv(loc('u_colors'), cd);
    gl.uniform1f(loc('u_flow_type'), FLOW_TYPE);
    gl.uniform1f(loc('u_zoom'), ZOOM);
    gl.uniform2f(loc('u_pan'), ${params.panX}, ${params.panY});
    gl.uniform1f(loc('u_flow_speed'), FLOW_SPEED);
    gl.uniform1f(loc('u_liquid_str'), LIQUID_STR);
    gl.uniform1f(loc('u_morph'), MORPH);
    gl.uniform1f(loc('u_rotation'), ROTATION);
    gl.uniform1i(loc('u_enable_art'), ART_ENABLE);
    gl.uniform1f(loc('u_art_type'), ART_TYPE);
    gl.uniform1f(loc('u_art_size'), ART_SIZE);
    gl.uniform1f(loc('u_art_shape'), ART_SHAPE);
    gl.uniform1f(loc('u_art_contrast'), ART_CONTRAST);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(loc('u_bg_texture'), 0);
    gl.uniform1i(loc('u_has_bg_texture'), HAS_BG);
    gl.uniform1i(loc('u_color_mode'), ${params.colorMode});
    gl.uniform1f(loc('u_blend_bias'), ${params.blendBias / 100.0});
    gl.uniform1f(loc('u_blend_sharp'), ${params.blendSharp / 100.0});
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
<\/script>
</body>
</html>`;
}
