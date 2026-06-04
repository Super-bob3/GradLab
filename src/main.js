/**
 * main.js — Application Entry Point
 * Wires together: engine, matrix, controls, and export modules.
 */

import { initEngine, uploadBgTexture, syncSlider, setCameraPos, getCameraPos } from './engine.js';
import { initMatrixCanvas, initMatrix } from './matrix.js';
import { initControls, getCurrentColors } from './controls.js';
import { initDownload, initRecording, initCodeExport } from './export.js';
import { mountControls } from './components.js';
import { splitHover } from './split-hover.js';

// ── DOM References ────────────────────────────────────────────
const glCanvas       = document.getElementById('glCanvas');
const textCanvas     = document.getElementById('text-canvas');
const cardContainer  = document.getElementById('cardContainer');
const shaderCard     = document.getElementById('shaderCard');

// ── Boot sequence ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mount slider components, then wire controls
    mountControls();
    initControls(() => initMatrix());

    // 2. Matrix canvas overlay
    initMatrixCanvas(glCanvas, cardContainer);

    // 3. WebGL engine + render loop
    initEngine(glCanvas, null, cardContainer, shaderCard, getCurrentColors);

    // Expose camera helpers for theme presets
    window._setCameraPos = setCameraPos;
    window._getCameraPos = getCameraPos;

    // Apply full default theme (colors + all params) now that all modules are ready
    const defaultBtn = document.querySelector('.preset-btn.active');
    if (window.applyColorPreset) window.applyColorPreset('theme1', defaultBtn);

    // 4. Background image upload
    document.getElementById('bg-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) uploadBgTexture(file);
        e.target.value = '';
    });

    // 5. Export features
    initDownload(glCanvas);
    initRecording(glCanvas);
    initCodeExport(getCurrentColors);

    // 6. Split hover text effect — logo only
    splitHover(document.querySelector('.title-name'), { stagger: 40, duration: 400 });

    // 7. Mobile bottom sheet
    initBottomSheet();
});

// ── Mobile Bottom Sheet ───────────────────────────────────────
function initBottomSheet() {
    const wrapper = document.getElementById('panelWrapper');
    const handle  = document.getElementById('sheetHandle');
    const overlay = document.getElementById('sheetOverlay');
    if (!wrapper || !handle) return;

    const MOBILE_BREAKPOINT = 768;
    let isOpen = false;
    let dragStartY = 0;
    let dragStartTranslate = 0;
    let currentTranslate = 0;
    let isDragging = false;

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function getCollapsedTranslate() {
        return wrapper.offsetHeight - 72;
    }

    function open() {
        isOpen = true;
        currentTranslate = 0;
        wrapper.style.transform = `translateY(0px)`;
        wrapper.classList.add('sheet-open');
        overlay.classList.add('visible');
    }

    function close() {
        isOpen = false;
        currentTranslate = getCollapsedTranslate();
        wrapper.style.transform = '';
        wrapper.classList.remove('sheet-open');
        overlay.classList.remove('visible');
    }

    function toggle() {
        isOpen ? close() : open();
    }

    const panel = wrapper.querySelector('.panel');

    // When closed: the whole wrapper captures touch to drag open.
    // When open: only the handle captures touch to drag closed;
    //            panel content is free to scroll.
    wrapper.addEventListener('touchstart', (e) => {
        if (!isMobile()) return;
        // If open, only the handle should start a drag
        if (isOpen && !handle.contains(e.target)) return;
        isDragging = true;
        dragStartY = e.touches[0].clientY;
        dragStartTranslate = isOpen ? 0 : getCollapsedTranslate();
        wrapper.style.transition = 'none';
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || !isMobile()) return;
        const dy = e.touches[0].clientY - dragStartY;

        // When closed: block scroll, drag the sheet up
        if (!isOpen) {
            e.preventDefault();
            currentTranslate = Math.max(0, Math.min(getCollapsedTranslate(), dragStartTranslate + dy));
            wrapper.style.transform = `translateY(${currentTranslate}px)`;
            return;
        }

        // When open and dragging handle downward: move sheet down
        if (dy > 0) {
            e.preventDefault();
            currentTranslate = Math.min(getCollapsedTranslate(), dy);
            wrapper.style.transform = `translateY(${currentTranslate}px)`;
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        if (!isDragging || !isMobile()) return;
        isDragging = false;
        wrapper.style.transition = '';

        const mid = getCollapsedTranslate() / 2;
        if (currentTranslate < mid) {
            open();
        } else {
            close();
        }
    });

    // Tap handle to toggle
    handle.addEventListener('click', () => {
        if (!isMobile()) return;
        toggle();
    });

    // Tap overlay to close
    overlay.addEventListener('click', close);

    // Reset on resize (desktop → mobile)
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            wrapper.style.transform = '';
            wrapper.style.transition = '';
            overlay.classList.remove('visible');
            isOpen = false;
        }
    });
}
