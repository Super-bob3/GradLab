/**
 * components.js — Reusable control component factories
 *
 * 如何添加新控件（三步）：
 *   1. 在对应的 *_CONFIGS 里加一条配置
 *   2. 在 index.html 放占位符 <div data-slider/select/toggle/colorpill="key">
 *   3. 完成 — 结构、样式、JS 接线自动处理
 *
 * 占位符类型：
 *   <div data-slider="key">      → createSlider()
 *   <div data-select="key">      → createSelect()
 *   <div data-toggle="key">      → createToggle()
 *   <div data-colorpill="key">   → createColorPill()
 */

// ─────────────────────────────────────────────────────────────────
// SLIDER
// CSS 依赖：.control-group:has(input[type="range"])  见 styles.css 组件注释
// 可选字段：labelId（给 label 加 id，供 JS 动态修改文字）
//           groupId（给外层 div 加 id，供 JS 控制显隐）
// ─────────────────────────────────────────────────────────────────
export const SLIDER_CONFIGS = {
    'blend-bias':    { label: 'Blend Bias',      id: 'blend-bias',    min: 1,   max: 100, step: 1,   value: 50  },
    'blend-sharp':   { label: 'Blend Sharpness', id: 'blend-sharp',   min: 0,   max: 100, step: 1,   value: 0   },
    'zoom':          { label: 'Zoom Scale',      id: 'zoom',          min: 0,   max: 100, step: 1,   value: 36  },
    'speed':         { label: 'Flow Speed',      id: 'speed',         min: 0,   max: 100, step: 1,   value: 15  },
    'liquid':        { label: 'Liquefy Distort', id: 'liquid',        min: 0,   max: 100, step: 1,   value: 40  },
    'morph':         { label: 'Shape Morph',     id: 'morph',         min: 0,   max: 100, step: 1,   value: 0,   labelId: 'label-morph' },
    'rotation':      { label: 'Rotation Angle',  id: 'rotation',      min: 0,   max: 360, step: 1,   value: 0   },
    'grain':         { label: 'Pixel Grain',     id: 'grain',         min: 0,   max: 100, step: 1,   value: 15  },
    'art-size':      { label: 'Dither Size',     id: 'art-size',      min: 1,   max: 30,  step: 0.1, value: 5.3 },
    'art-contrast':  { label: 'Dither Contrast', id: 'art-contrast',  min: 0,   max: 100, step: 1,   value: 30  },
    'ascii-size':    { label: 'Grid Size',       id: 'ascii-size',    min: 10,  max: 60,  step: 1,   value: 22  },
    'ascii-font':    { label: 'Char Size',       id: 'ascii-font',    min: 5,   max: 60,  step: 1,   value: 14  },
    'ascii-spacing': { label: 'Char Spacing',    id: 'ascii-spacing', min: 0.5, max: 2.0, step: 0.1, value: 1.0 },
    'ascii-radius':  { label: 'Field Radius',    id: 'ascii-radius',  min: 50,  max: 500, step: 1,   value: 240, groupId: 'group-ascii-radius' },
    'ascii-smooth':  { label: 'Pointer Smooth',  id: 'ascii-smooth',  min: 0,   max: 99,  step: 1,   value: 75,  groupId: 'group-ascii-smooth'  },
    'ascii-gravity': { label: 'Grid Gravity',    id: 'ascii-gravity', min: -50, max: 50,  step: 1,   value: 10  },
    'ascii-decay':   { label: 'Thermal Decay',   id: 'ascii-decay',   min: 0,   max: 100, step: 1,   value: 20,  groupId: 'group-ascii-decay'   },
};

export function createSlider({ label, id, min, max, step = 1, value, labelId, groupId }) {
    const group = document.createElement('div');
    group.className = 'control-group control-group--slider';
    if (groupId) group.id = groupId;
    group.innerHTML = `
        <label${labelId ? ` id="${labelId}"` : ''}>${label}</label>
        <div class="slider-wrap">
            <input type="range" id="ctrl-${id}" min="${min}" max="${max}" step="${step}" value="${value}">
            <span class="val-text" id="val-${id}">${value}</span>
        </div>`;
    return group;
}

// ─────────────────────────────────────────────────────────────────
// SELECT
// options 支持两种格式：
//   平铺  { value, label, selected? }
//   分组  { group, options: [...] }
// 可选字段：groupId（外层 div 的 id）
//           hidden（初始 display:none，由 JS 控制显隐）
// ─────────────────────────────────────────────────────────────────
export const SELECT_CONFIGS = {
    'type': {
        label: 'Algorithm', id: 'type',
        options: [
            { group: 'Fluid Dynamics (Chaos)', options: [
                { value: '0',  label: 'Sin/Cos (Classic)' },
                { value: '1',  label: 'Smooth Noise' },
                { value: '2',  label: 'Fractal (FBM)' },
                { value: '3',  label: 'Domain Warp (Marble)' },
                { value: '4',  label: 'Curl Noise (Vortex)' },
                { value: '5',  label: 'Polar Vortex (Cosmic)' },
            ]},
            { group: 'Structured Mapping (Order)', options: [
                { value: '6',  label: 'Linear Stratified (Vertical)' },
                { value: '7',  label: 'Radial Topography (Rings)' },
                { value: '8',  label: 'Conic Sweep (Angular)' },
            ]},
            { group: 'Diffusion Gradient (Organic)', options: [
                { value: '9',  label: 'Diffusion Fluid (Image)' },
                { value: '10', label: 'Diffusion Fluid (Procedural SDF)' },
            ]},
            { group: 'SDF Topology', options: [
                { value: '11', label: 'Nested SDF Shape (Core Glow)', selected: true },
                { value: '12', label: '3D Liquid Depth' },
            ]},
        ],
    },
    'grain-blend': {
        label: 'Grain Blend', id: 'grain-blend',
        options: [
            { value: 'overlay',      label: 'Overlay',      selected: true },
            { value: 'screen',       label: 'Screen' },
            { value: 'soft-light',   label: 'Soft Light' },
            { value: 'color-dodge',  label: 'Color Dodge' },
            { value: 'color-burn',   label: 'Color Burn' },
            { value: 'luminosity',   label: 'Luminosity' },
        ],
    },
    'art-type': {
        label: 'Dither Type', id: 'art-type',
        options: [
            { value: '0', label: 'Random' },
            { value: '1', label: '2×2' },
            { value: '2', label: '4×4' },
            { value: '3', label: '8×8', selected: true },
        ],
    },
    'art-shape': {
        label: 'Dither Shape', id: 'art-shape',
        options: [
            { value: '0', label: 'Square',          selected: true },
            { value: '1', label: 'Circle' },
            { value: '2', label: 'Triangle' },
            { value: '3', label: 'Cross (+)' },
            { value: '4', label: 'Vertical Lines' },
            { value: '5', label: 'Horizontal Lines' },
        ],
    },
    'ascii-mode': {
        label: 'Mode', id: 'ascii-mode',
        options: [
            { value: '0', label: 'Dynamic Background' },
            { value: '1', label: 'Heatmap Decay', selected: true },
        ],
    },
    'ascii-dither': {
        label: 'Dither Algorithm', id: 'ascii-dither',
        groupId: 'group-ascii-dither', hidden: true,
        options: [
            { value: 'none',      label: 'Smooth Wave',       selected: true },
            { value: 'bayer',     label: 'Bayer (Ordered)' },
            { value: 'fs',        label: 'Floyd-Steinberg' },
            { value: 'atkinson',  label: 'Atkinson' },
        ],
    },
    'ascii-charset': {
        label: 'Character Set', id: 'ascii-charset',
        options: [
            { value: 'code',     label: 'Code Snippet',     selected: true },
            { value: 'standard', label: 'Standard (@%#*+)' },
            { value: 'blocks',   label: 'Blocks (██▓▒░)' },
            { value: 'detailed', label: 'Detailed ($@B%8)' },
            { value: 'minimal',  label: 'Minimal (·■)' },
            { value: 'binary',   label: 'Binary (01)' },
            { value: 'custom',   label: 'Custom Text' },
        ],
    },
    'ascii-blend': {
        label: 'Blend Mode', id: 'ascii-blend',
        options: [
            { value: 'source-over', label: 'Normal',       selected: true },
            { value: 'screen',      label: 'Screen' },
            { value: 'overlay',     label: 'Overlay' },
            { value: 'color-dodge', label: 'Color Dodge' },
            { value: 'lighter',     label: 'Lighter' },
        ],
    },
    'feedback-topic': {
        label: 'Topic', id: 'feedback-topic',
        placeholder: 'Please select',
        options: [
            { value: 'bug',     label: 'Bug Report' },
            { value: 'feature', label: 'Feature Request' },
            { value: 'general', label: 'General Feedback' },
        ],
    },
};

function _renderOptions(options) {
    return options.map(opt => {
        if (opt.group) {
            const inner = opt.options.map(o =>
                `<option value="${o.value}"${o.selected ? ' selected' : ''}>${o.label}</option>`
            ).join('');
            return `<optgroup label="${opt.group}">${inner}</optgroup>`;
        }
        return `<option value="${opt.value}"${opt.selected ? ' selected' : ''}>${opt.label}</option>`;
    }).join('');
}

export function createSelect({ label, id, options, groupId, hidden, placeholder }) {
    const group = document.createElement('div');
    group.className = 'control-group control-group--select';
    if (groupId) group.id = groupId;
    if (hidden)  group.style.display = 'none';
    const placeholderOpt = placeholder
        ? `<option value="" disabled selected hidden>${placeholder}</option>`
        : '';
    group.innerHTML = `
        <label>${label}</label>
        <select id="ctrl-${id}">${placeholderOpt}${_renderOptions(options)}</select>`;
    return group;
}

// ─────────────────────────────────────────────────────────────────
// TOGGLE
// CSS 依赖：.control-group:has(input[type="checkbox"])
// ─────────────────────────────────────────────────────────────────
export const TOGGLE_CONFIGS = {
    'color-mode':   { label: 'OKLch Color',       id: 'color-mode'   },
    'art-enable':   { label: 'Enable Effect',    id: 'art-enable'   },
    'ascii-enable': { label: 'Enable Matrix',    id: 'ascii-enable' },
    'pingpong':     { label: 'Loop (Pingpong)',   id: 'pingpong'     },
};

export function createToggle({ label, id }) {
    const group = document.createElement('div');
    group.className = 'control-group control-group--toggle';
    group.innerHTML = `
        <label>${label}</label>
        <label class="toggle" for="ctrl-${id}">
            <input type="checkbox" id="ctrl-${id}">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
        </label>`;
    return group;
}

// ─────────────────────────────────────────────────────────────────
// COLOR PILL
// CSS 依赖：.control-group:has(.color-pill)
// 生成的 id 规则：swatch → {id}-swatch, picker → ctrl-{id}, hex → val-{id}
// ─────────────────────────────────────────────────────────────────
export const COLORPILL_CONFIGS = {
    'ascii-color': { label: 'Base Color', id: 'ascii-color', value: '#ffffff' },
};

export function createColorPill({ label, id, value = '#ffffff' }) {
    const hex = value.toUpperCase();
    const group = document.createElement('div');
    group.className = 'control-group control-group--color-pill';
    group.innerHTML = `
        <label>${label}</label>
        <div class="color-pill">
            <div class="color-swatch" id="${id}-swatch" style="background:${value}"></div>
            <input type="color" id="ctrl-${id}" value="${value}" class="color-picker-input">
            <input type="text" class="hex-input" id="val-${id}" value="${hex}" maxlength="7">
        </div>`;
    return group;
}

// ─────────────────────────────────────────────────────────────────
// MOUNT ALL — 在 initControls() 之前调用一次
// ─────────────────────────────────────────────────────────────────
export function mountControls() {
    document.querySelectorAll('[data-slider]').forEach(p => {
        const c = SLIDER_CONFIGS[p.dataset.slider];
        if (c) p.replaceWith(createSlider(c));
    });
    document.querySelectorAll('[data-select]').forEach(p => {
        const c = SELECT_CONFIGS[p.dataset.select];
        if (c) p.replaceWith(createSelect(c));
    });
    document.querySelectorAll('[data-toggle]').forEach(p => {
        const c = TOGGLE_CONFIGS[p.dataset.toggle];
        if (c) p.replaceWith(createToggle(c));
    });
    document.querySelectorAll('[data-colorpill]').forEach(p => {
        const c = COLORPILL_CONFIGS[p.dataset.colorpill];
        if (c) p.replaceWith(createColorPill(c));
    });
}
