/**
 * controls.js — Control Panel UI Logic
 * Manages: color system, presets, theme, language, context-aware UI,
 *          image color picker, and slider sync.
 */

// ── Color State ───────────────────────────────────────────────
export const MAX_COLORS = 8;
export const MIN_COLORS = 2;

export let currentColors = [];
let currentThemeKey = 'theme1';
let draggedColorIndex = null;
let activeMarker = null;

// Full theme presets — each theme stores colors + all shader/post parameters
const themePresets = {
    theme1: {
        // Aurora — warm organic fluid, silky smooth
        colors:       ['#FFB3C6', '#FF6B35', '#7B2FBE', '#FFF1E6'],
        colorMode:    '1',
        blendBias:    '45',
        blendSharp:   '0',
        type:         '3',   // Domain Warp (Marble)
        zoom:         '40',
        speed:        '12',
        liquid:       '55',
        morph:        '0',
        rotation:     '0',
        grain:        '20',
        grainBlend:   'overlay',
        artEnable:    false,
        artType:      '3',
        artSize:      '5.3',
        artShape:     '1',
        artContrast:  '30',
        asciiEnable:  false,
        asciiMode:    '1',
        asciiDither:  'none',
        asciiSize:    '22',
        asciiSpacing: '1.0',
        asciiFont:    '14',
        asciiColor:   '#FFB3C6',
        asciiBlend:   'overlay',
        asciiDecay:   '20',
        asciiRadius:  '200',
        asciiSmooth:  '60',
        asciiGravity: '0',
        asciiCharset: 'standard',
        asciiCustom:  '',
    },
    theme2: {
        // Neon Abyss — dark cyberpunk, glowing ASCII trails
        colors:       ['#00FFFF', '#FF00FF', '#0A0A2E', '#7700FF'],
        colorMode:    '1',
        blendBias:    '50',
        blendSharp:   '15',
        type:         '4',   // Curl Noise (Vortex)
        zoom:         '30',
        speed:        '28',
        liquid:       '70',
        morph:        '0',
        rotation:     '0',
        grain:        '25',
        grainBlend:   'screen',
        artEnable:    false,
        artType:      '3',
        artSize:      '5.3',
        artShape:     '1',
        artContrast:  '30',
        asciiEnable:  true,
        asciiMode:    '1',
        asciiDither:  'none',
        asciiSize:    '22',
        asciiSpacing: '1.0',
        asciiFont:    '14',
        asciiColor:   '#00FFFF',
        asciiBlend:   'screen',
        asciiDecay:   '15',
        asciiRadius:  '180',
        asciiSmooth:  '50',
        asciiGravity: '0',
        asciiCharset: 'code',
        asciiCustom:  '',
    },
    theme3: {
        // Topography — cool structured rings with halftone
        colors:       ['#00C9B1', '#1A1A2E', '#9B5DE5', '#00F5D4'],
        colorMode:    '1',
        blendBias:    '50',
        blendSharp:   '30',
        type:         '7',   // Radial Topography (Rings)
        zoom:         '45',
        speed:        '8',
        liquid:       '25',
        morph:        '50',
        rotation:     '0',
        grain:        '10',
        grainBlend:   'soft-light',
        artEnable:    true,
        artType:      '3',
        artSize:      '6.0',
        artShape:     '1',   // Circle
        artContrast:  '40',
        asciiEnable:  false,
        asciiMode:    '0',
        asciiDither:  'bayer',
        asciiSize:    '20',
        asciiSpacing: '1.0',
        asciiFont:    '20',
        asciiColor:   '#00F5D4',
        asciiBlend:   'source-over',
        asciiDecay:   '20',
        asciiRadius:  '240',
        asciiSmooth:  '75',
        asciiGravity: '10',
        asciiCharset: 'blocks',
        asciiCustom:  '',
    },
};

export function getCurrentColors() { return currentColors; }

function saveToCurrentTheme() {
    if (currentThemeKey) themePresets[currentThemeKey].colors = [...currentColors];
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
    'Download Code': '下载代码', 'Close': '关闭', 'Loop (Pingpong)': '乒乓循环',
};
const reverseDict = Object.fromEntries(Object.entries(dict).map(([k, v]) => [v, k]));

function updateThemeBtn() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeBtn = document.getElementById('btn-theme');
    if (isChinese) themeBtn.innerText = isDark ? '浅色模式' : '深色模式';
    else           themeBtn.innerText = isDark ? 'Light Mode' : 'Dark Mode';
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
    document.querySelectorAll('.controls, .modal-box').forEach(el => walk(el));
    updateThemeBtn();
}

// ── Init Controls ─────────────────────────────────────────────
export function initControls(onMatrixRebuild) {
    // Initial colors
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
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('pipeline-shader-theme', targetTheme);
        updateThemeBtn();
    });

    // Language toggle
    document.getElementById('btn-lang').addEventListener('click', toggleLanguage);

    // Preset buttons — apply full theme (colors + all parameters)
    window.applyColorPreset = function(name, btnEl) {
        currentThemeKey = name;
        const t = themePresets[name];

        // Colors
        currentColors = [...t.colors];
        renderColorList();

        // Helper to set a control value and sync its display span
        function setCtrl(id, val) {
            const el = document.getElementById('ctrl-' + id);
            if (!el) return;
            if (el.type === 'checkbox') el.checked = val;
            else el.value = val;
            const span = document.getElementById('val-' + id);
            if (span) span.innerText = val;
        }

        setCtrl('color-mode',    t.colorMode);
        setCtrl('blend-bias',    t.blendBias);
        setCtrl('blend-sharp',   t.blendSharp);
        setCtrl('type',          t.type);
        setCtrl('zoom',          t.zoom);
        setCtrl('speed',         t.speed);
        setCtrl('liquid',        t.liquid);
        setCtrl('morph',         t.morph);
        setCtrl('rotation',      t.rotation);
        setCtrl('grain',         t.grain);
        setCtrl('grain-blend',   t.grainBlend);
        setCtrl('art-enable',    t.artEnable);
        setCtrl('art-type',      t.artType);
        setCtrl('art-size',      t.artSize);
        setCtrl('art-shape',     t.artShape);
        setCtrl('art-contrast',  t.artContrast);
        setCtrl('ascii-enable',  t.asciiEnable);
        setCtrl('ascii-mode',    t.asciiMode);
        setCtrl('ascii-dither',  t.asciiDither);
        setCtrl('ascii-size',    t.asciiSize);
        setCtrl('ascii-spacing', t.asciiSpacing);
        setCtrl('ascii-font',    t.asciiFont);
        setCtrl('ascii-color',   t.asciiColor);
        setCtrl('ascii-blend',   t.asciiBlend);
        setCtrl('ascii-decay',   t.asciiDecay);
        setCtrl('ascii-radius',  t.asciiRadius);
        setCtrl('ascii-smooth',  t.asciiSmooth);
        setCtrl('ascii-gravity', t.asciiGravity);
        setCtrl('ascii-charset', t.asciiCharset);
        setCtrl('ascii-custom',  t.asciiCustom);

        // Sync grain overlay opacity & blend
        document.getElementById('noiseOverlay').style.opacity      = (t.grain / 100) * 0.6;
        document.getElementById('noiseOverlay').style.mixBlendMode = t.grainBlend;

        // Sync ASCII mode UI (dither/radius/smooth/decay visibility)
        document.getElementById('ctrl-ascii-mode').dispatchEvent(new Event('change'));

        // Sync context-aware UI (morph/rotation visibility)
        document.getElementById('ctrl-type').dispatchEvent(new Event('change'));

        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');

        if (onMatrixRebuild) onMatrixRebuild();
    };

    // Add color
    document.getElementById('btn-add-color').addEventListener('click', () => {
        if (currentColors.length < MAX_COLORS) {
            currentColors.push('#ffffff');
            saveToCurrentTheme();
            renderColorList();
        }
    });

    // Slider sync
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const valId = e.target.id.replace('ctrl-', 'val-');
            const valEl = document.getElementById(valId);
            if (valEl) valEl.innerText = e.target.value;
            if (e.target.id === 'ctrl-grain') {
                document.getElementById('noiseOverlay').style.opacity = (e.target.value / 100) * 0.6;
            }
        });
    });

    // Blend bias/sharp display sync
    ['blend-bias', 'blend-sharp'].forEach(id => {
        const el = document.getElementById('ctrl-' + id);
        const val = document.getElementById('val-' + id);
        if (el && val) el.addEventListener('input', () => { val.textContent = el.value; });
    });

    // Context-aware UI
    const ctrlType = document.getElementById('ctrl-type');
    ctrlType.addEventListener('change', updateContextUI);
    updateContextUI();

    // Matrix Advanced toggle
    window.toggleMatrixAdvanced = function() {
        const group = document.getElementById('matrix-advanced-group');
        const arrow = document.getElementById('matrix-adv-arrow');
        const isOpen = group.style.display === 'flex';
        group.style.display   = isOpen ? 'none' : 'flex';
        group.style.flexDirection = 'column';
        group.style.gap       = '0';
        arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
    };

    // ASCII Mode states
    const asciiModeStates = {
        '0': { 'ctrl-ascii-dither': 'none', 'ctrl-ascii-size': '20', 'ctrl-ascii-font': '20', 'ctrl-ascii-spacing': '1.0', 'ctrl-ascii-blend': 'source-over', 'ctrl-ascii-radius': '240', 'ctrl-ascii-smooth': '75', 'ctrl-ascii-gravity': '10', 'ctrl-ascii-decay': '20', 'ctrl-ascii-charset': 'code', 'ctrl-ascii-custom': '', 'ctrl-ascii-color': '#00ffff' },
        '1': { 'ctrl-ascii-dither': 'none', 'ctrl-ascii-size': '22', 'ctrl-ascii-font': '14', 'ctrl-ascii-spacing': '1.0', 'ctrl-ascii-blend': 'overlay', 'ctrl-ascii-radius': '70', 'ctrl-ascii-smooth': '50', 'ctrl-ascii-gravity': '5', 'ctrl-ascii-decay': '20', 'ctrl-ascii-charset': 'code', 'ctrl-ascii-custom': '', 'ctrl-ascii-color': '#ffffff' },
    };

    let currentAsciiMode = document.getElementById('ctrl-ascii-mode').value;
    const asciiControls  = Object.keys(asciiModeStates['0']);

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

    // Grain overlay init
    const grainEl = document.getElementById('ctrl-grain');
    document.getElementById('noiseOverlay').style.opacity = (grainEl.value / 100) * 0.6;

    document.getElementById('ctrl-grain-blend').addEventListener('change', (e) => {
        document.getElementById('noiseOverlay').style.mixBlendMode = e.target.value;
    });

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

        const leftWrap   = document.createElement('div'); leftWrap.className = 'color-item-left';
        const handle     = document.createElement('span'); handle.className = 'drag-handle'; handle.innerText = '⋮⋮';
        const label      = document.createElement('span'); label.className = 'color-item-label'; label.innerText = `Color ${index + 1}`;
        leftWrap.appendChild(handle); leftWrap.appendChild(label);

        const wrap      = document.createElement('div'); wrap.className = 'color-wrap';
        const inputHex  = document.createElement('input'); inputHex.type = 'text'; inputHex.className = 'hex-input'; inputHex.value = hex.toUpperCase(); inputHex.maxLength = 7;
        const inputColor = document.createElement('input'); inputColor.type = 'color'; inputColor.value = hex;
        const btnDel    = document.createElement('button'); btnDel.className = 'btn-del'; btnDel.innerText = '×';
        btnDel.disabled = currentColors.length <= MIN_COLORS;

        inputColor.addEventListener('input', (e) => {
            inputHex.value = e.target.value.toUpperCase();
            currentColors[index] = e.target.value;
            saveToCurrentTheme();
        });
        inputHex.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                inputColor.value = val; currentColors[index] = val; saveToCurrentTheme();
            }
        });
        inputHex.addEventListener('blur', (e) => {
            let val = e.target.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            inputHex.value = /^#[0-9A-F]{6}$/i.test(val) ? val.toUpperCase() : inputColor.value.toUpperCase();
        });
        btnDel.addEventListener('click', () => {
            if (currentColors.length > MIN_COLORS) {
                currentColors.splice(index, 1);
                saveToCurrentTheme();
                renderColorList();
            }
        });

        wrap.appendChild(inputHex); wrap.appendChild(inputColor); wrap.appendChild(btnDel);
        item.appendChild(leftWrap); item.appendChild(wrap);
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
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const MAX_H = window.innerHeight * 0.6;
                const MAX_W = window.innerWidth  * 0.8;
                let w = img.width, h = img.height;
                if (w > MAX_W || h > MAX_H) {
                    const ratio = Math.min(MAX_W / w, MAX_H / h);
                    w *= ratio; h *= ratio;
                }
                pickerContainer.style.width  = w + 'px';
                pickerContainer.style.height = h + 'px';
                pickerCanvas.width  = img.width;
                pickerCanvas.height = img.height;
                pickerCtx.drawImage(img, 0, 0);
                initPickerMarkers(true);
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
        handleImageFile(e.target.files[0]);
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
    const closeModal = () => { modal.style.display = 'none'; };
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-picker-done').addEventListener('click', closeModal);
}

function _initBgDropZone() {
    // Background image drop zone is handled by engine.js uploadBgTexture
    // via the bg-upload input change event set up in main.js
}
