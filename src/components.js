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
 *
 * 组件约定（props-in / onChange-out）：
 *   - 每个 factory 接受 props 配置对象 + 可选 onChange 回调
 *   - 组件内部自己处理 UI 同步（swatch/display 更新）
 *   - controls.js 只提供业务回调，不再手动 querySelector + 绑事件
 */

import { openColorPicker } from './color-picker.js';
import { sound } from './sound.js';

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
// SEGMENTED CONTROL
// CSS 依赖：.sg-control / .sg-glider / .sg-btn
// 生成的 id：hidden input → ctrl-{id}
// ─────────────────────────────────────────────────────────────────
export const SEGMENT_CONFIGS = {
    'color-mode': {
        id:      'color-mode',
        label:   'Color Space',
        options: ['RGB', 'OKLCH', 'OKLAB'],
        default: 1,
    },
};

export function createSegmentedControl({ id, label, options, default: defaultIndex = 0 }) {
    const group = document.createElement('div');
    group.className = 'control-group control-group--segment';

    const n = options.length;
    const optionsHtml = options.map((opt, i) =>
        `<button type="button" class="sg-btn" data-index="${i}" aria-selected="${i === defaultIndex}">${opt}</button>`
    ).join('');

    group.innerHTML = `
        <label>${label}</label>
        <div class="sg-control" role="group">
            <div class="sg-glider"></div>
            ${optionsHtml}
            <input type="hidden" id="ctrl-${id}" value="${defaultIndex}">
        </div>`;

    const glider  = group.querySelector('.sg-glider');
    const buttons = group.querySelectorAll('.sg-btn');
    const hidden  = group.querySelector(`#ctrl-${id}`);

    function _move(index, animate = true) {
        const btn = buttons[index];
        if (!animate) glider.style.transition = 'none';
        glider.style.left  = btn.offsetLeft + 'px';
        glider.style.width = btn.offsetWidth + 'px';
        if (!animate) requestAnimationFrame(() => { glider.style.transition = ''; });
        buttons.forEach((b, i) => b.setAttribute('aria-selected', i === index ? 'true' : 'false'));
        hidden.value = index;
        hidden.dispatchEvent(new Event('input'));
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            import('./sound.js').then(m => m.sound.tap());
            _move(parseInt(btn.dataset.index));
        });
    });

    // Init after layout so offsetLeft/offsetWidth are available
    requestAnimationFrame(() => _move(defaultIndex, false));

    return group;
}

// ─────────────────────────────────────────────────────────────────
// GLIDER UTILITY — 给任意 preset-group 类容器附加滑块动画
// 用法：const update = attachGlider(containerEl);  update(activeBtn);
// ─────────────────────────────────────────────────────────────────
export function attachGlider(container) {
    let glider = container.querySelector('.sg-glider');
    if (!glider) {
        glider = document.createElement('div');
        glider.className = 'sg-glider';
        container.prepend(glider);
    }

    function update(btn, animate = true) {
        if (!btn) return;
        if (!animate) glider.style.transition = 'none';
        glider.style.left  = btn.offsetLeft + 'px';
        glider.style.width = btn.offsetWidth + 'px';
        if (!animate) requestAnimationFrame(() => { glider.style.transition = ''; });
    }

    requestAnimationFrame(() => {
        update(container.querySelector('.active'), false);
    });

    return update;
}

// ─────────────────────────────────────────────────────────────────
// COLOR PILL
// CSS 依赖：.control-group:has(.color-pill)
// 生成的 id 规则：swatch → {id}-swatch, picker → ctrl-{id}, hex → val-{id}
// ─────────────────────────────────────────────────────────────────
export const COLORPILL_CONFIGS = {
    'ascii-color': { label: 'Base Color', id: 'ascii-color', value: '#ffffff' },
};

export function createColorPill({ label, id, value = '#ffffff', onChange }) {
    const group = document.createElement('div');
    group.className = 'control-group control-group--color-pill';
    group.innerHTML = `
        <label>${label}</label>
        <div class="color-pill">
            <div class="color-swatch" id="${id}-swatch" style="background:${value}"></div>
            <input type="color" id="ctrl-${id}" value="${value}" class="color-picker-input">
            <input type="text" class="hex-input" id="val-${id}" value="${value.toUpperCase()}" maxlength="7">
        </div>`;

    const swatch      = group.querySelector('.color-swatch');
    const hiddenInput = group.querySelector('.color-picker-input');
    const hexInput    = group.querySelector('.hex-input');

    function _sync(hex) {
        swatch.style.background = hex;
        hexInput.value          = hex.toUpperCase();
        hiddenInput.value       = hex;
    }

    // Keep display in sync when value is changed programmatically (e.g. _setCtrlSync / theme apply)
    hiddenInput.addEventListener('input', () => {
        swatch.style.background = hiddenInput.value;
        hexInput.value          = hiddenInput.value.toUpperCase();
    });

    swatch.addEventListener('click', () => {
        openColorPicker(swatch, hiddenInput.value, (newHex) => {
            _sync(newHex);
            hiddenInput.dispatchEvent(new Event('input'));
            onChange?.(newHex);
        });
    });

    hexInput.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            _sync(val);
            hiddenInput.dispatchEvent(new Event('input'));
            onChange?.(val);
        }
    });

    hexInput.addEventListener('blur', () => {
        let val = hexInput.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (!/^#[0-9A-F]{6}$/i.test(val)) _sync(hiddenInput.value);
    });

    return group;
}

// ─────────────────────────────────────────────────────────────────
// MODAL
//
// createModal({ title, description?, content, footerLeft?, footerRight?, onOpen?, onClose? })
//
// footerLeft / footerRight: 数组，每项 { label, icon?, className?, onClick, disabled? }
//   icon: Remix Icon class，如 'ri-close-line'
//   className 默认 'action-btn'，次要按钮传 'action-btn action-btn--line'
// content: HTMLElement | string（innerHTML）
// 返回 { el, open(), close(), body }
// ─────────────────────────────────────────────────────────────────

export function createModal({ title, description = '', content, footerLeft = [], footerRight = [], onOpen, onClose } = {}) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.display = 'none';

    const _btnHtml = ({ label, icon = '', className = 'action-btn', disabled = false }) =>
        `<button class="${className}"${disabled ? ' disabled' : ''}>${icon ? `<i class="${icon}"></i> ` : ''}${label}</button>`;

    overlay.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <div class="modal-header-text">
                    <span class="modal-title">${title}</span>
                    ${description ? `<span class="modal-description">${description}</span>` : ''}
                </div>
                <button class="modal-close"><i class="ri-close-line"></i></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <div class="modal-footer-left">${footerLeft.map(_btnHtml).join('')}</div>
                <div class="modal-footer-right">${footerRight.map(_btnHtml).join('')}</div>
            </div>
        </div>`;

    document.body.appendChild(overlay);

    const box  = overlay.querySelector('.modal-box');
    const body = overlay.querySelector('.modal-body');

    if (typeof content === 'string') {
        body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        body.appendChild(content);
    }

    const _wire = (buttons, container) => {
        buttons.forEach((cfg, i) => {
            if (cfg.onClick) container.children[i].addEventListener('click', cfg.onClick);
        });
    };
    _wire(footerLeft,  overlay.querySelector('.modal-footer-left'));
    _wire(footerRight, overlay.querySelector('.modal-footer-right'));

    function open() {
        sound.open();
        overlay.style.display = 'flex';
        onOpen?.();
    }

    function close() {
        sound.close();
        overlay.classList.add('modal-overlay--closing');
        box.addEventListener('animationend', () => {
            overlay.classList.remove('modal-overlay--closing');
            overlay.style.display = 'none';
            onClose?.();
        }, { once: true });
    }

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.style.display === 'flex') close(); });
    overlay.querySelector('.modal-close').addEventListener('click', close);

    return { el: overlay, open, close, body };
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
    document.querySelectorAll('[data-segment]').forEach(p => {
        const c = SEGMENT_CONFIGS[p.dataset.segment];
        if (c) p.replaceWith(createSegmentedControl(c));
    });
    document.querySelectorAll('[data-colorpill]').forEach(p => {
        const c = COLORPILL_CONFIGS[p.dataset.colorpill];
        if (c) p.replaceWith(createColorPill(c));
    });
}
