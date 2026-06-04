/**
 * main.js — Application Entry Point
 * Wires together: engine, matrix, controls, and export modules.
 */

import { initEngine, uploadBgTexture, syncSlider, setCameraPos, getCameraPos } from './engine.js';
import { initMatrixCanvas, initMatrix } from './matrix.js';
import { initControls, getCurrentColors } from './controls.js';
import { initDownload, initRecording, initCodeExport } from './export.js';
import { mountControls } from './components.js';

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
});
