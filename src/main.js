/**
 * main.js — Application Entry Point
 * Wires together: engine, matrix, controls, and export modules.
 */

import { initEngine, uploadBgTexture, syncSlider } from './engine.js';
import { initMatrixCanvas, initMatrix } from './matrix.js';
import { initControls, getCurrentColors } from './controls.js';
import { initDownload, initRecording, initCodeExport } from './export.js';

// ── DOM References ────────────────────────────────────────────
const glCanvas       = document.getElementById('glCanvas');
const textCanvas     = document.getElementById('text-canvas');
const noiseOverlay   = document.getElementById('noiseOverlay');
const cardContainer  = document.getElementById('cardContainer');
const shaderCard     = document.getElementById('shaderCard');

// ── Boot sequence ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Controls UI (color list, sliders, matrix UI)
    initControls(() => initMatrix());

    // 2. Matrix canvas overlay
    initMatrixCanvas(glCanvas, cardContainer);

    // 3. WebGL engine + render loop
    initEngine(glCanvas, noiseOverlay, cardContainer, shaderCard, getCurrentColors);

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
