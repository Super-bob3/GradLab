/**
 * main.js — Application Entry Point
 * Wires together: engine, matrix, controls, and export modules.
 */

import { initEngine, uploadBgTexture, syncSlider, setCameraPos, getCameraPos } from './engine.js';
import { initMatrixCanvas, initMatrix } from './matrix.js';
import { initControls, getCurrentColors, setImageFileHook } from './controls.js';
import { importParams } from './params.js';
import { decodeBarcode } from './barcode.js';
import { initDownload, initRecording, initCodeExport } from './export.js';
import { mountControls } from './components.js';
import { splitHover } from './split-hover.js';
import { initFeedback } from './feedback.js';
import { sound } from './sound.js';

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
    if (window.applyColorPreset) window.applyColorPreset('theme1', defaultBtn, true);

    // 4. Background image upload
    document.getElementById('bg-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadBgTexture(file);
            if (typeof umami !== 'undefined') umami.track('upload_bg_image');
        }
        e.target.value = '';
    });

    // 5. Export features
    initDownload(glCanvas, getCurrentColors);
    initRecording(glCanvas, getCurrentColors);
    initCodeExport(getCurrentColors);

    // 6. Split hover text effect — logo only
    splitHover(document.querySelector('.title-name'), { stagger: 40, duration: 400 });

    // 7. Feedback widget
    initFeedback();

    // 8a. Barcode import hook — intercepts Upload Image if a PDF417 barcode is detected
    setImageFileHook(async (file) => {
        try {
            const text = await decodeBarcode(file);
            if (text && importParams(text)) return true;
        } catch (e) {
            console.warn('[barcode] import failed:', e);
        }
        return false;
    });

    // 8b. Docs link sound
    document.querySelector('a.feedback-trigger')
        ?.addEventListener('click', () => sound.tap());

    // 9. Mobile bottom sheet
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

    let startScrollTop = 0;

    // When closed: whole wrapper drags to open.
    // When open: handle drags to close; panel content at top + downward swipe also closes.
    wrapper.addEventListener('touchstart', (e) => {
        if (!isMobile()) return;
        dragStartY = e.touches[0].clientY;
        startScrollTop = panel.scrollTop;

        if (!isOpen) {
            // Closed — always enter drag mode
            isDragging = true;
            dragStartTranslate = getCollapsedTranslate();
            wrapper.style.transition = 'none';
        } else if (handle.contains(e.target)) {
            // Open, touching handle — enter drag mode to close
            isDragging = true;
            dragStartTranslate = 0;
            wrapper.style.transition = 'none';
        }
        // Otherwise (open, touching panel content): wait for touchmove to decide
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isMobile()) return;
        const dy = e.touches[0].clientY - dragStartY;

        if (!isOpen) {
            // Closed: block scroll, drag sheet up
            if (!isDragging) return;
            e.preventDefault();
            currentTranslate = Math.max(0, Math.min(getCollapsedTranslate(), dragStartTranslate + dy));
            wrapper.style.transform = `translateY(${currentTranslate}px)`;
            return;
        }

        if (isDragging) {
            // Handle-initiated drag: move sheet down
            if (dy > 0) {
                e.preventDefault();
                currentTranslate = Math.min(getCollapsedTranslate(), dy);
                wrapper.style.transform = `translateY(${currentTranslate}px)`;
            }
            return;
        }

        // Open, panel content: if scrolled to top and swiping down, start closing
        if (startScrollTop === 0 && dy > 8) {
            isDragging = true;
            dragStartTranslate = 0;
            wrapper.style.transition = 'none';
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        if (!isMobile()) return;
        if (!isDragging) return;
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
