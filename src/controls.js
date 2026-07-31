/**
 * controls.js — Control Panel UI Logic
 * Manages: color system, presets, theme, language, context-aware UI,
 *          image color picker, and slider sync.
 */

import { sound } from './sound.js';
import { openColorPicker } from './color-picker.js';
import { attachGlider } from './components.js';

// ── Color State ───────────────────────────────────────────────
export const MAX_COLORS = 8;
export const MIN_COLORS = 2;

export let currentColors = [];
let _onMatrixRebuild = null;
let _imageFileHook = null;

export function setImageFileHook(fn) { _imageFileHook = fn; }
let currentThemeKey = 'theme1';
let draggedColorIndex = null;
let touchDragIndex   = null;
let touchDragEl      = null;
let touchDragClone   = null;
let touchDragOver    = null;
let activeMarker = null;

// Full theme presets — each theme stores colors + all shader/post parameters
const themePresets = {
    theme1: {
        colors:       ['#FB7C47', '#E1B8FF', '#0883F7'],
        blendBias:    '65',
        blendSharp:   '0',
        type:         '11',  // Nested SDF Shape (Core Glow)
        zoom:         '18',
        speed:        '25',
        liquid:       '25',
        morph:        '69',
        rotation:     '80',
        grain:        '20',
        grainBlend:   'overlay',
        artEnable:    false,
        artType:      '3',
        artSize:      '5.3',
        artShape:     '1',
        artContrast:  '30',
        asciiEnable:  true,
        asciiMode:    '1',
        asciiDither:  'none',
        asciiSize:    '22',
        asciiSpacing: '1',
        asciiFont:    '14',
        asciiColor:   '#ffffff',
        asciiBlend:   'overlay',
        asciiDecay:   '20',
        asciiRadius:  '50',
        asciiSmooth:  '60',
        asciiGravity: '0',
        asciiCharset: 'code',
        asciiCustom:  '',
        panX:         -1.411,
        panY:         0.640,
    },
    theme2: {
        colors:       ['#FFFFFF', '#DCB8FF', '#295EFF', '#FF666E'],
        blendBias:    '87',
        blendSharp:   '0',
        type:         '7',   // Radial Topography (Rings)
        zoom:         '52',
        speed:        '70',
        liquid:       '100',
        morph:        '12',
        rotation:     '194',
        grain:        '25',
        grainBlend:   'screen',
        artEnable:    true,
        artType:      '3',
        artSize:      '6',
        artShape:     '0',
        artContrast:  '20',
        asciiEnable:  true,
        asciiMode:    '1',
        asciiDither:  'none',
        asciiSize:    '22',
        asciiSpacing: '1',
        asciiFont:    '14',
        asciiColor:   '#ffffff',
        asciiBlend:   'overlay',
        asciiDecay:   '20',
        asciiRadius:  '50',
        asciiSmooth:  '50',
        asciiGravity: '0',
        asciiCharset: 'code',
        asciiCustom:  '',
        panX:         0.548,
        panY:         0.468,
    },
    theme3: {
        colors:       ['#FFC8DD', '#FF9E00', '#0033FF'],
        blendBias:    '1',
        blendSharp:   '0',
        type:         '0',   // Sin/Cos (Classic)
        zoom:         '33',
        speed:        '8',
        liquid:       '25',
        morph:        '0',
        rotation:     '0',
        grain:        '15',
        grainBlend:   'overlay',
        artEnable:    false,
        artType:      '3',
        artSize:      '6.0',
        artShape:     '1',
        artContrast:  '40',
        asciiEnable:  true,
        asciiMode:    '1',
        asciiDither:  'none',
        asciiSize:    '22',
        asciiSpacing: '1.0',
        asciiFont:    '14',
        asciiColor:   '#ffffff',
        asciiBlend:   'overlay',
        asciiDecay:   '20',
        asciiRadius:  '50',
        asciiSmooth:  '50',
        asciiGravity: '5',
        asciiCharset: 'code',
        asciiCustom:  '',
        panX:         1.256,
        panY:         0.502,
    },
};

export function getCurrentColors() { return currentColors; }

function saveToCurrentTheme() {
    if (currentThemeKey) themeStates[currentThemeKey].colors = [...currentColors];
}

// Runtime state per theme — starts as deep copy of presets, updated as user edits
const themeStates = {
    theme1: JSON.parse(JSON.stringify(themePresets.theme1)),
    theme2: JSON.parse(JSON.stringify(themePresets.theme2)),
    theme3: JSON.parse(JSON.stringify(themePresets.theme3)),
};

// Snapshot all current control values into themeStates[key]
function _saveThemeState(key) {
    if (!themeStates[key]) return;
    const s = themeStates[key];
    function r(id) { const el = document.getElementById('ctrl-' + id); return el ? el.value : undefined; }
    function rb(id) { const el = document.getElementById('ctrl-' + id); return el ? el.checked : false; }
    s.colors      = [...currentColors];
    s.blendBias   = r('blend-bias');
    s.blendSharp  = r('blend-sharp');
    s.type        = r('type');
    s.zoom        = r('zoom');
    s.speed       = r('speed');
    s.liquid      = r('liquid');
    s.morph       = r('morph');
    s.rotation    = r('rotation');
    s.grain       = r('grain');
    s.grainBlend  = r('grain-blend');
    s.artEnable   = rb('art-enable');
    s.artType     = r('art-type');
    s.artSize     = r('art-size');
    s.artShape    = r('art-shape');
    s.artContrast = r('art-contrast');
    s.asciiEnable  = rb('ascii-enable');
    s.asciiMode    = r('ascii-mode');
    s.asciiDither  = r('ascii-dither');
    s.asciiSize    = r('ascii-size');
    s.asciiSpacing = r('ascii-spacing');
    s.asciiFont    = r('ascii-font');
    s.asciiColor   = r('ascii-color');
    s.asciiBlend   = r('ascii-blend');
    s.asciiDecay   = r('ascii-decay');
    s.asciiRadius  = r('ascii-radius');
    s.asciiSmooth  = r('ascii-smooth');
    s.asciiGravity = r('ascii-gravity');
    s.asciiCharset = r('ascii-charset');
    s.asciiCustom  = r('ascii-custom');
    if (window._getCameraPos) {
        const pos = window._getCameraPos();
        s.panX = pos.x;
        s.panY = pos.y;
    }
}

function rgb2hex(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

// ── Theme & Language ──────────────────────────────────────────
let isChinese = false;

const dict = {
    'ENGINE CONTROLS': '引擎控制面板', 'Color Themes': '色彩预设', 'Theme 1': '预设 1', 'Theme 2': '预设 2', 'Theme 3': '预设 3',
    'Stage 1 · Palette': '阶段 1 · 调色盘', 'Upload Image to Extract Colors': '上传图片以提取颜色', '+ Add Color': '+ 添加颜色',
    'Stage 2 · Shape & Flow': '阶段 2 · 形态与流动', 'Algorithm': '算法模型',
    'Fluid Dynamics (Chaos)': '流体力学 (混沌分布)', 'Sin/Cos (Classic)': '经典正余弦流 (Classic)',
    'Smooth Noise': '平滑噪声 (Smooth Noise)', 'Fractal (FBM)': '分形噪声 (FBM)',
    'Domain Warp (Marble)': '流形扭曲 (Marble)', 'Curl Noise (Vortex)': '卷曲漩涡 (Vortex)',
    'Polar Vortex (Cosmic)': '极地漩涡 (Cosmic)', 'Structured Mapping (Order)': '结构化映射 (有序阵列)',
    'Linear Stratified (Vertical)': '线性竖向分层', 'Radial Topography (Rings)': '径向等高线环',
    'Conic Sweep (Angular)': '圆锥角向扫描', 'Diffusion Gradient (Organic)': '弥散渐变 (柔和有机)',
    'Diffusion Fluid (Image)': '弥散流体 (图片纹理映射)', 'Diffusion Fluid (Procedural SDF)': '弥散流体 (多点SDF数学场)',
    'Upload Background Image for Diffusion': '上传底图以生成流体弥散',
    'Zoom Scale': '缩放比例', 'Shape Morph': '节点形态切换', 'Rotation Angle': '空间旋转角度',
    'Flow Speed': '流动演化速度', 'Liquefy Distort': '液化扭曲强度',
    'Blend Bias': '过渡重心', 'Blend Sharpness': '过渡硬度',
    'Stage 3 · Post-Processing': '阶段 3 · 后期处理', 'Pixel Grain': '电影胶片噪点',
    'Inner Border': '内部描边', 'Corner Radius': '卡片圆角', 'Tilt Depth': '倾斜悬浮深度',
    'Stage 4 · Halftone Effect': '阶段 4 · 半调效果', 'Enable Effect': '启用效果',
    'Dither Type': '抖动类型', 'Random': '白噪声', '2×2': '2×2 矩阵', '4×4': '4×4 矩阵', '8×8': '8×8 矩阵',
    'Dither Size': '抖动像素尺寸', 'Dither Shape': '抖动形状', 'Square': '正方形',
    'Circle': '圆形', 'Triangle': '三角形', 'Cross (+)': '十字架 (+)',
    'Vertical Lines': '垂直线条', 'Horizontal Lines': '水平线条', 'Dither Contrast': '抖动对比度',
    'Stage 5 · Interactive Matrix': '阶段 5 · 交互字符矩阵', 'Enable Matrix': '启用字符矩阵',
    'Mode': '交互模式', 'Dynamic Background': '动态背景 (模式 0)', 'Heatmap Decay': '热力尾迹 (模式 1)',
    'Dither Algorithm': '抖动算法', 'Smooth Wave': '平滑波形',
    'Bayer (Ordered)': 'Bayer (有序)', 'Floyd-Steinberg': 'Floyd-Steinberg (误差扩散)', 'Atkinson': 'Atkinson (高对比)',
    'Character Set': '字符集', 'Code Snippet': '代码片段', 'Standard (@%#*+)': '标准符列',
    'Blocks (██▓▒░)': '方块', 'Detailed ($@B%8)': '精细字符', 'Minimal (·■)': '极简',
    'Binary (01)': '二进制', 'Custom Text': '自定义', 'Advanced': '高级选项',
    'Grid Size': '网格尺寸', 'Char Size': '字符大小', 'Char Spacing': '字符间距',
    'Base Color': '基准色', 'Blend Mode': '混合模式', 'Screen': '滤色',
    'Overlay': '叠加', 'Color Dodge': '颜色减淡', 'Lighter': '加色',
    'Field Radius': '交互半径', 'Pointer Smooth': '指针惯性', 'Grid Gravity': '网格重力',
    'Thermal Decay': '热力衰减', 'Download Frame': '保存截图', 'Visual Color Picker': '画面取色器',
    '- Color': '- 移除', '+ Color': '+ 新增', 'Done': '完成',
    '⏺ Record MP4': '⏺ 录制视频', '⟨/⟩ Export Code': '⟨/⟩ 导出代码',
    'Export Standalone Code': '导出独立代码', 'Copy Code': '复制代码',
    'Download Code': '下载代码', 'Download Param Code': '下载参数码', 'Close': '关闭', 'Loop (Pingpong)': '乒乓循环',
};
const reverseDict = Object.fromEntries(Object.entries(dict).map(([k, v]) => [v, k]));

function updateThemeBtn() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeBtn = document.getElementById('btn-theme');
    themeBtn.innerHTML = isDark ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
}

function toggleLanguage() {
    isChinese = !isChinese;
    function walk(node) {
        if (node.nodeType === 3) {
            const text = node.nodeValue.trim();
            if (text && dict[text] && isChinese)         node.nodeValue = dict[text];
            else if (text && reverseDict[text] && !isChinese) node.nodeValue = reverseDict[text];
        } else if (node.nodeType === 1 && node.id !== 'btn-lang' && node.id !== 'btn-theme') {
            for (let i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]);
        }
    }
    document.querySelectorAll('.panel, .modal-box').forEach(el => walk(el));
    updateThemeBtn();
}

// ── Init Controls ─────────────────────────────────────────────
function _setCtrl(id, val) {
    const el = document.getElementById('ctrl-' + id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = val;
    else el.value = val;
    const span = document.getElementById('val-' + id);
    if (span) span.innerText = val;
}

function _setCtrlSync(id, val) {
    const el = document.getElementById('ctrl-' + id);
    if (!el) return;
    el.value = val;
    const span = document.getElementById('val-' + id);
    if (span) span.innerText = val;
    el.dispatchEvent(new Event('input'));
}

export function applyStateObject(t) {
    currentColors = [...t.colors];
    renderColorList();

    _setCtrl('blend-bias',    t.blendBias);
    _setCtrl('blend-sharp',   t.blendSharp);
    _setCtrl('type',          t.type);
    _setCtrl('zoom',          t.zoom);
    _setCtrl('speed',         t.speed);
    _setCtrl('liquid',        t.liquid);
    _setCtrl('morph',         t.morph);
    _setCtrl('rotation',      t.rotation);
    _setCtrl('grain',         t.grain);
    _setCtrl('grain-blend',   t.grainBlend);
    _setCtrl('art-enable',    t.artEnable);
    _setCtrl('art-type',      t.artType);
    _setCtrl('art-size',      t.artSize);
    _setCtrl('art-shape',     t.artShape);
    _setCtrl('art-contrast',  t.artContrast);
    _setCtrl('ascii-enable',  t.asciiEnable);
    _setCtrl('ascii-mode',    t.asciiMode);
    document.getElementById('ctrl-ascii-mode').dispatchEvent(new Event('change'));
    _setCtrlSync('ascii-dither',  t.asciiDither);
    _setCtrlSync('ascii-size',    t.asciiSize);
    _setCtrlSync('ascii-spacing', t.asciiSpacing);
    _setCtrlSync('ascii-font',    t.asciiFont);
    _setCtrlSync('ascii-color',   t.asciiColor);
    _setCtrlSync('ascii-blend',   t.asciiBlend);
    _setCtrlSync('ascii-decay',   t.asciiDecay);
    _setCtrlSync('ascii-radius',  t.asciiRadius);
    _setCtrlSync('ascii-smooth',  t.asciiSmooth);
    _setCtrlSync('ascii-gravity', t.asciiGravity);
    _setCtrlSync('ascii-charset', t.asciiCharset);
    _setCtrlSync('ascii-custom',  t.asciiCustom);

    if (window._setCameraPos) window._setCameraPos(t.panX || 0, t.panY || 0);
    document.getElementById('ctrl-type').dispatchEvent(new Event('change'));
    if (_onMatrixRebuild) _onMatrixRebuild();
}

export function initControls(onMatrixRebuild) {
    _onMatrixRebuild = onMatrixRebuild;
    // Initial colors (full theme applied later in main.js after engine init)
    currentColors = [...themePresets[currentThemeKey].colors];
    renderColorList();

    // Theme toggle
    const themeBtn = document.getElementById('btn-theme');
    updateThemeBtn();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('pipeline-shader-theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeBtn();
        }
    });
    themeBtn.addEventListener('click', () => {
        sound.tap();
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('pipeline-shader-theme', targetTheme);
        updateThemeBtn();
    });

    // Language toggle
    document.getElementById('btn-lang').addEventListener('click', () => { sound.tap(); toggleLanguage(); });

    // Preset buttons — apply full theme (colors + all parameters)
    const _presetGlider = attachGlider(document.querySelector('.preset-group'));
    window.applyColorPreset = function(name, btnEl, _fromInit = false) {
        sound.preset();
        if (!_fromInit && typeof umami !== 'undefined') umami.track('apply_preset', { preset: name });
        if (currentThemeKey && currentThemeKey !== name) _saveThemeState(currentThemeKey);
        currentThemeKey = name;
        applyStateObject(themeStates[name]);
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        if (btnEl) { btnEl.classList.add('active'); _presetGlider(btnEl); }
    };

    // Add color
    document.getElementById('btn-add-color').addEventListener('click', () => {
        if (currentColors.length < MAX_COLORS) {
            sound.tap();
            currentColors.push('#ffffff');
            saveToCurrentTheme();
            renderColorList();
            if (typeof umami !== 'undefined') umami.track('add_color', { color_count: currentColors.length });
        }
    });

    // ── Random colors ────────────────────────────────────────────
    function _hexToHSL(hex) {
        const n = parseInt(hex.slice(1), 16);
        const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let h = 0, s = 0;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4;
            }
            h *= 60;
        }
        return { h, s: s * 100, l: l * 100 };
    }

    function _hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
    }

    // 每个颜色基于它原有的色相做 0~10° 抖动；S/L 按手工实测拟合出的公式随机
    // （目前公式只针对红色系测过，还没做色相相关的修正）
    function _randomColors(n, existingColors) {
        const hueJitterMax = 10;
        const sMin = 78, sMax = 100;

        return Array.from({ length: n }, (_, i) => {
            const source = existingColors[i] || existingColors[existingColors.length - 1] || '#888888';
            const originalH = _hexToHSL(source).h;
            const jitter = (Math.random() * 2 - 1) * hueJitterMax; // 基于该颜色原有色相抖动
            const H = (originalH + jitter + 360) % 360;

            const S = sMin + Math.random() * (sMax - sMin);
            const Lmin = 68.3 - 0.229 * S;
            const Lmax = 1.63 * S - 75;
            const L = Lmin + Math.random() * (Lmax - Lmin);

            return _hslToHex(H, S, L);
        });
    }

    document.getElementById('btn-random-colors').addEventListener('click', () => {
        const n = currentColors.length;
        const existing = [...currentColors]; // 抖动前先存一份原有颜色，供取原色相用
        currentColors.length = 0;
        _randomColors(n, existing).forEach(c => currentColors.push(c));
        saveToCurrentTheme();
        renderColorList();
        sound.preset();
        if (typeof umami !== 'undefined') umami.track('random_colors', { count: n });
    });

    // Shuffle color order — guaranteed different from current order
    document.getElementById('btn-shuffle-colors').addEventListener('click', () => {
        if (currentColors.length < 2) return;
        sound.tap();
        const original = [...currentColors];
        let attempts = 0;
        do {
            for (let i = currentColors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentColors[i], currentColors[j]] = [currentColors[j], currentColors[i]];
            }
            attempts++;
        } while (attempts < 10 && currentColors.every((c, i) => c === original[i]));
        saveToCurrentTheme();
        renderColorList();
        if (typeof umami !== 'undefined') umami.track('shuffle_colors');
    });

    // Select auto-width: hug selected option text, max 240px
    const _measureSpan = document.createElement('span');
    _measureSpan.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;font-size:14px;font-family:"Geist",sans-serif;padding:0 10px;white-space:nowrap;';
    document.body.appendChild(_measureSpan);

    function autoSizeSelect(select) {
        const text = select.options[select.selectedIndex]?.text ?? '';
        _measureSpan.textContent = text;
        const w = Math.min(_measureSpan.offsetWidth + 2, 240);
        select.style.width = w + 'px';
    }

    document.querySelectorAll('select').forEach(select => {
        autoSizeSelect(select);
        select.addEventListener('change', (e) => { if (e.isTrusted) sound.select(); autoSizeSelect(select); });
    });

    // Slider sync
    function setSliderProgress(input) {
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || 100;
        const pct = (parseFloat(input.value) - min) / (max - min) * 100;
        input.closest('.control-group')?.style.setProperty('--progress', pct);
    }

    document.querySelectorAll('input[type="range"]').forEach(input => {
        setSliderProgress(input);
        input.addEventListener('input', (e) => {
            if (e.isTrusted) sound.tick();
            const valId = e.target.id.replace('ctrl-', 'val-');
            const valEl = document.getElementById(valId);
            if (valEl) valEl.innerText = e.target.value;
            setSliderProgress(e.target);
        });
    });

    // Blend bias/sharp display sync
    ['blend-bias', 'blend-sharp'].forEach(id => {
        const el = document.getElementById('ctrl-' + id);
        const val = document.getElementById('val-' + id);
        if (el && val) el.addEventListener('input', () => { val.textContent = el.value; });
    });

    // Toggle sounds + feature tracking
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            sound.toggle(e.target.checked);
            if (!e.isTrusted || typeof umami === 'undefined') return;
            if (e.target.id === 'ctrl-ascii-enable') umami.track('toggle_ascii',    { enabled: e.target.checked });
            if (e.target.id === 'ctrl-art-enable')   umami.track('toggle_halftone', { enabled: e.target.checked });
        });
    });

    // Context-aware UI
    const ctrlType = document.getElementById('ctrl-type');
    ctrlType.addEventListener('change', (e) => {
        updateContextUI();
        if (e.isTrusted && typeof umami !== 'undefined') {
            const label = e.target.options[e.target.selectedIndex]?.text ?? e.target.value;
            umami.track('select_algorithm', { type: parseInt(e.target.value), label });
        }
    });
    updateContextUI();

    // Matrix Advanced toggle
    window.toggleMatrixAdvanced = function() {
        const group = document.getElementById('matrix-advanced-group');
        const btn   = document.getElementById('btn-matrix-advanced');
        const isOpen = group.classList.contains('open');
        isOpen ? sound.close() : sound.open();
        group.classList.toggle('open', !isOpen);
        btn.classList.toggle('open', !isOpen);
    };

    // ASCII Mode states
    const asciiModeStates = {
        '0': { 'ctrl-ascii-dither': 'none', 'ctrl-ascii-size': '20', 'ctrl-ascii-font': '20', 'ctrl-ascii-spacing': '1.0', 'ctrl-ascii-blend': 'source-over', 'ctrl-ascii-radius': '240', 'ctrl-ascii-smooth': '75', 'ctrl-ascii-gravity': '10', 'ctrl-ascii-decay': '20', 'ctrl-ascii-charset': 'code', 'ctrl-ascii-custom': '', 'ctrl-ascii-color': '#00ffff' },
        '1': { 'ctrl-ascii-dither': 'none', 'ctrl-ascii-size': '22', 'ctrl-ascii-font': '14', 'ctrl-ascii-spacing': '1.0', 'ctrl-ascii-blend': 'overlay', 'ctrl-ascii-radius': '70', 'ctrl-ascii-smooth': '50', 'ctrl-ascii-gravity': '5', 'ctrl-ascii-decay': '20', 'ctrl-ascii-charset': 'code', 'ctrl-ascii-custom': '', 'ctrl-ascii-color': '#ffffff' },
    };

    let currentAsciiMode = document.getElementById('ctrl-ascii-mode').value;
    const asciiControls  = Object.keys(asciiModeStates['0']);

    // createColorPill handles its own swatch/hex/hidden-input sync.
    // We only need to hook into the hidden input's input event for state + rebuild.
    asciiControls.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', (e) => {
            asciiModeStates[currentAsciiMode][id] = e.target.value;
            if (id === 'ctrl-ascii-charset') {
                document.getElementById('group-custom-text').style.display = e.target.value === 'custom' ? 'flex' : 'none';
            }
            if (onMatrixRebuild) onMatrixRebuild();
        });
    });

    document.getElementById('ctrl-ascii-mode').addEventListener('change', (e) => {
        currentAsciiMode = e.target.value;
        const state = asciiModeStates[currentAsciiMode];
        asciiControls.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = state[id];
                const span = document.getElementById(id.replace('ctrl-', 'val-'));
                if (span) span.innerText = state[id];
            }
        });
        document.getElementById('group-custom-text').style.display = state['ctrl-ascii-charset'] === 'custom' ? 'flex' : 'none';
        const isDynamic = currentAsciiMode === '0';
        document.getElementById('group-ascii-dither').style.display  = isDynamic ? 'flex' : 'none';
        document.getElementById('group-ascii-radius').style.display  = isDynamic ? 'none' : 'flex';
        document.getElementById('group-ascii-smooth').style.display  = isDynamic ? 'none' : 'flex';
        document.getElementById('group-ascii-decay').style.display   = isDynamic ? 'none' : 'flex';
        if (onMatrixRebuild) onMatrixRebuild();
    });

    // Initialize to default mode
    document.getElementById('ctrl-ascii-mode').dispatchEvent(new Event('change'));

    // Grain is rendered each frame by engine._renderGrain()

    _initImagePicker();
    _initBgDropZone();
}

// ── Context-Aware UI ──────────────────────────────────────────
function updateContextUI() {
    const type           = parseFloat(document.getElementById('ctrl-type').value);
    const wrapperContext = document.getElementById('wrapper-context-sliders');
    const labelMorph     = document.getElementById('label-morph');
    const ctrlMorphWrap  = document.getElementById('ctrl-morph').parentElement.parentElement;

    document.getElementById('bg-drop-zone').style.display = (type >= 9.0 && type < 9.5) ? 'flex' : 'none';

    if (type === 11.0 || type === 12.0) {
        wrapperContext.style.display = 'flex';
        ctrlMorphWrap.style.display = 'flex';
        labelMorph.innerText = 'Shape Morph';
    } else if (type >= 6.0 && type < 9.0) {
        wrapperContext.style.display = 'flex';
        if (type < 6.5) {
            ctrlMorphWrap.style.display = 'flex';
            labelMorph.innerText = 'Wavy Strata';
        } else if (type < 7.5) {
            ctrlMorphWrap.style.display = 'flex';
            labelMorph.innerText = 'Shape Morph';
        } else {
            ctrlMorphWrap.style.display = 'none';
        }
    } else if (type >= 9.0) {
        wrapperContext.style.display = 'none';
    } else {
        wrapperContext.style.display = 'none';
    }
}

// ── Color List ────────────────────────────────────────────────
function renderColorList() {
    const container = document.getElementById('color-list');
    const btnAdd    = document.getElementById('btn-add-color');
    container.innerHTML = '';

    currentColors.forEach((hex, index) => {
        const item = document.createElement('div');
        item.className = 'color-item';
        item.draggable = true;
        item.dataset.index = index;

        item.addEventListener('dragstart', (e) => {
            draggedColorIndex = index;
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => {
            draggedColorIndex = null;
            item.classList.remove('dragging');
            document.querySelectorAll('.color-item').forEach(el => el.classList.remove('drag-over'));
        });
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedColorIndex === null || draggedColorIndex === index) return;
            e.dataTransfer.dropEffect = 'move';
            item.classList.add('drag-over');
        });
        item.addEventListener('dragleave', () => { item.classList.remove('drag-over'); });
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('drag-over');
            if (draggedColorIndex === null || draggedColorIndex === index) return;
            const dragged = currentColors[draggedColorIndex];
            currentColors.splice(draggedColorIndex, 1);
            currentColors.splice(index, 0, dragged);
            saveToCurrentTheme();
            renderColorList();
        });

        // Left: drag handle + label
        const leftWrap = document.createElement('div'); leftWrap.className = 'color-item-left';
        const handle   = document.createElement('span'); handle.className = 'drag-handle';
        handle.innerHTML = '<i class="ri-draggable"></i>';
        const label    = document.createElement('span'); label.className = 'color-item-label'; label.innerText = `Color ${index + 1}`;
        leftWrap.appendChild(handle); leftWrap.appendChild(label);

        handle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchDragIndex = index;
            touchDragEl    = item;
            item.classList.add('dragging');
            // ghost clone that follows the finger
            touchDragClone = item.cloneNode(true);
            touchDragClone.style.cssText = `
                position:fixed;pointer-events:none;z-index:9999;
                width:${item.offsetWidth}px;opacity:0.85;
                box-shadow:0 4px 16px rgba(0,0,0,.25);border-radius:8px;
            `;
            const r = item.getBoundingClientRect();
            touchDragClone.style.top  = r.top  + 'px';
            touchDragClone.style.left = r.left + 'px';
            document.body.appendChild(touchDragClone);
        }, { passive: false });

        handle.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (touchDragIndex === null) return;
            const t = e.touches[0];
            touchDragClone.style.top  = (t.clientY - touchDragClone.offsetHeight / 2) + 'px';
            touchDragClone.style.left = (t.clientX - touchDragClone.offsetWidth  / 2) + 'px';
            // find target item under finger
            touchDragClone.style.display = 'none';
            const el = document.elementFromPoint(t.clientX, t.clientY);
            touchDragClone.style.display = '';
            const target = el && el.closest('.color-item');
            if (touchDragOver && touchDragOver !== target) touchDragOver.classList.remove('drag-over');
            if (target && target !== touchDragEl) {
                touchDragOver = target;
                target.classList.add('drag-over');
            } else {
                touchDragOver = null;
            }
        }, { passive: false });

        handle.addEventListener('touchend', () => {
            if (touchDragClone) { touchDragClone.remove(); touchDragClone = null; }
            document.querySelectorAll('.color-item').forEach(el => el.classList.remove('dragging', 'drag-over'));
            if (touchDragOver) {
                const toIdx = parseInt(touchDragOver.dataset.index, 10);
                if (!isNaN(toIdx) && toIdx !== touchDragIndex) {
                    const dragged = currentColors[touchDragIndex];
                    currentColors.splice(touchDragIndex, 1);
                    currentColors.splice(toIdx, 0, dragged);
                    saveToCurrentTheme();
                    renderColorList();
                }
            }
            touchDragIndex = null;
            touchDragEl    = null;
            touchDragOver  = null;
        });

        // Right: color pill
        const pill       = document.createElement('div'); pill.className = 'color-pill';
        const swatch     = document.createElement('div'); swatch.className = 'color-swatch'; swatch.style.background = hex;
        const inputColor = document.createElement('input'); inputColor.type = 'color'; inputColor.value = hex; inputColor.className = 'color-picker-input';
        const inputHex   = document.createElement('input'); inputHex.type = 'text'; inputHex.className = 'hex-input'; inputHex.value = hex.toUpperCase(); inputHex.maxLength = 7;
        const btnDel     = document.createElement('button'); btnDel.className = 'btn-del';
        btnDel.innerHTML = '<i class="ri-close-line"></i>';
        btnDel.disabled  = currentColors.length <= MIN_COLORS;

        function _syncPill(newHex) {
            swatch.style.background = newHex;
            inputHex.value          = newHex.toUpperCase();
            inputColor.value        = newHex.toLowerCase();
            currentColors[index]    = newHex.toLowerCase();
            saveToCurrentTheme();
        }

        swatch.addEventListener('click', () => {
            const _initialHex = (inputColor.value || hex).toLowerCase();
            let _changed = false;
            openColorPicker(swatch, _initialHex, (newHex) => {
                _syncPill(newHex);
                if (newHex.toLowerCase() !== _initialHex) _changed = true;
            }, () => {
                if (_changed && typeof umami !== 'undefined') umami.track('edit_color', { method: 'picker' });
            });
        });

        inputHex.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-F]{6}$/i.test(val)) _syncPill(val);
        });

        inputHex.addEventListener('blur', () => {
            let val = inputHex.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                inputHex.value = val.toUpperCase();
                if (typeof umami !== 'undefined') umami.track('edit_color', { method: 'hex' });
            } else {
                inputHex.value = inputColor.value.toUpperCase();
            }
        });
        btnDel.addEventListener('click', () => {
            if (currentColors.length > MIN_COLORS) {
                sound.tap();
                currentColors.splice(index, 1);
                saveToCurrentTheme();
                renderColorList();
                if (typeof umami !== 'undefined') umami.track('remove_color', { color_count: currentColors.length });
            }
        });

        const rightGroup = document.createElement('div'); rightGroup.className = 'color-right';
        pill.appendChild(swatch); pill.appendChild(inputColor); pill.appendChild(inputHex);
        rightGroup.appendChild(pill); rightGroup.appendChild(btnDel);
        item.appendChild(leftWrap); item.appendChild(rightGroup);
        container.appendChild(item);
    });

    btnAdd.style.display = currentColors.length >= MAX_COLORS ? 'none' : 'block';
}

// ── Image Color Picker ────────────────────────────────────────
function _initImagePicker() {
    const modal          = document.getElementById('picker-modal');
    const pickerCanvas   = document.getElementById('picker-canvas');
    const pickerCtx      = pickerCanvas.getContext('2d');
    const pickerContainer = document.getElementById('picker-container');

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        if (_imageFileHook) {
            _imageFileHook(file)
                .then(intercepted => { if (!intercepted) _openImagePicker(file); })
                .catch(() => _openImagePicker(file));
            return;
        }
        _openImagePicker(file);
    }

    function _openImagePicker(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                pickerCanvas.width  = img.width;
                pickerCanvas.height = img.height;
                pickerCtx.drawImage(img, 0, 0);
                pickerContainer.style.aspectRatio = `${img.width} / ${img.height}`;
                pickerContainer.style.width  = '';
                pickerContainer.style.height = '';
                initPickerMarkers(true);
                sound.open();
                modal.style.display = 'flex';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function sampleColorAtMarker(marker) {
        const pctX = parseFloat(marker.style.left) / 100;
        const pctY = parseFloat(marker.style.top) / 100;
        const pxX  = Math.max(0, Math.min(Math.floor(pctX * pickerCanvas.width), pickerCanvas.width - 1));
        const pxY  = Math.max(0, Math.min(Math.floor(pctY * pickerCanvas.height), pickerCanvas.height - 1));
        const data = pickerCtx.getImageData(pxX, pxY, 1, 1).data;
        const hex  = rgb2hex(data[0], data[1], data[2]);
        currentColors[marker.dataset.index] = hex;
        marker.style.backgroundColor = hex;
        saveToCurrentTheme();
        renderColorList();
    }

    function initPickerMarkers(autoSample = false) {
        const saved = {};
        document.querySelectorAll('.picker-marker').forEach(m => {
            saved[m.dataset.index] = { left: m.style.left, top: m.style.top };
            m.remove();
        });
        currentColors.forEach((color, index) => {
            const marker = document.createElement('div');
            marker.className = 'picker-marker';
            marker.dataset.index = index;
            if (saved[index]) {
                marker.style.left = saved[index].left;
                marker.style.top  = saved[index].top;
            } else {
                const pctX = 20 + (60 / Math.max(1, currentColors.length - 1)) * index;
                marker.style.left = pctX + '%';
                marker.style.top  = (40 + Math.random() * 20) + '%';
            }
            marker.style.backgroundColor = color;
            marker.addEventListener('mousedown', startDragMarker);
            marker.addEventListener('touchstart', startDragMarker, { passive: false });
            pickerContainer.appendChild(marker);
            if (autoSample) sampleColorAtMarker(marker);
        });
        document.getElementById('btn-picker-add').disabled    = currentColors.length >= MAX_COLORS;
        document.getElementById('btn-picker-remove').disabled  = currentColors.length <= MIN_COLORS;
    }

    function startDragMarker(e) {
        e.preventDefault();
        activeMarker = e.target;
        document.addEventListener('mousemove', onDragMarker);
        document.addEventListener('mouseup',   endDragMarker);
        document.addEventListener('touchmove', onDragMarker, { passive: false });
        document.addEventListener('touchend',  endDragMarker);
    }
    function onDragMarker(e) {
        if (!activeMarker) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect    = pickerContainer.getBoundingClientRect();
        let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(clientY - rect.top,  rect.height));
        activeMarker.style.left = (x / rect.width)  * 100 + '%';
        activeMarker.style.top  = (y / rect.height) * 100 + '%';
        sampleColorAtMarker(activeMarker);
    }
    function endDragMarker() {
        activeMarker = null;
        document.removeEventListener('mousemove', onDragMarker);
        document.removeEventListener('mouseup',   endDragMarker);
        document.removeEventListener('touchmove', onDragMarker);
        document.removeEventListener('touchend',  endDragMarker);
    }

    // Upload triggers
    document.getElementById('img-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
            if (typeof umami !== 'undefined') umami.track('upload_image_picker');
        }
        e.target.value = '';
    });

    const dropZone = document.getElementById('palette-drop-zone');
    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
    ['dragenter','dragover','dragleave','drop'].forEach(ev => document.body.addEventListener(ev, preventDefaults));
    ['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('dragover')));
    ['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, (e) => {
        if (e.type === 'dragleave' && dropZone.contains(e.relatedTarget)) return;
        dropZone.classList.remove('dragover');
    }));
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) handleImageFile(files[0]);
    });

    // Picker modal buttons
    document.getElementById('btn-picker-add').addEventListener('click', () => {
        if (currentColors.length < MAX_COLORS) {
            currentColors.push('#ffffff');
            saveToCurrentTheme();
            initPickerMarkers(false);
            const markers = document.querySelectorAll('.picker-marker');
            sampleColorAtMarker(markers[markers.length - 1]);
        }
    });
    document.getElementById('btn-picker-remove').addEventListener('click', () => {
        if (currentColors.length > MIN_COLORS) {
            currentColors.pop();
            saveToCurrentTheme();
            initPickerMarkers(false);
        }
    });
    const closeModal = () => { sound.close(); modal.style.display = 'none'; };
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-picker-done').addEventListener('click', closeModal);

}

function _initBgDropZone() {
    // Background image drop zone is handled by engine.js uploadBgTexture
    // via the bg-upload input change event set up in main.js
}
