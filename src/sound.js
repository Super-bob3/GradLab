/**
 * sound.js — Web Audio API sound effects for UI interactions
 * All sounds synthesized in real-time; no audio files needed.
 */

let _ctx = null;

function ctx() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
}

// Warm up AudioContext on first real user gesture so resume() completes before any sound plays
;['pointerdown', 'keydown'].forEach(ev =>
    document.addEventListener(ev, () => { if (_ctx && _ctx.state === 'suspended') _ctx.resume(); }, { passive: true })
);

function muted() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── Primitive builders ────────────────────────────────────────

function osc(type, freq, startTime, duration, gainPeak, ac) {
    const g = ac.createGain();
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, startTime);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    o.connect(g);
    g.connect(ac.destination);
    o.start(startTime);
    o.stop(startTime + duration + 0.01);
}

function oscSlide(type, freqStart, freqEnd, startTime, duration, gainPeak, ac) {
    const g = ac.createGain();
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freqStart, startTime);
    o.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    o.connect(g);
    g.connect(ac.destination);
    o.start(startTime);
    o.stop(startTime + duration + 0.01);
}

// ── Sound library ─────────────────────────────────────────────

export const sound = {

    // Crisp triangle tick for slider dragging — called on every input event
    tick() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        osc('triangle', 1400, t, 0.018, 0.07, ac);
    },

    // Short neutral click — buttons, selects, lang/theme toggle
    tap() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sine', 900, 600, t, 0.06, 0.12, ac);
    },

    // Checkbox toggle — distinct on/off pitch
    toggle(checked) {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        if (checked) {
            oscSlide('sine', 600, 900, t, 0.07, 0.14, ac);
        } else {
            oscSlide('sine', 900, 500, t, 0.07, 0.10, ac);
        }
    },

    // Preset switch — brief ascending two-note
    preset() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        osc('sine', 520, t,        0.06, 0.10, ac);
        osc('sine', 780, t + 0.05, 0.09, 0.12, ac);
    },

    // Confirm action — download screenshot, copy, download code
    confirm() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        osc('sine', 660, t,        0.07, 0.10, ac);
        osc('sine', 880, t + 0.06, 0.10, 0.10, ac);
    },

    // Recording start
    recordStart() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sawtooth', 200, 400, t, 0.12, 0.08, ac);
        osc('sine', 880, t + 0.10, 0.08, 0.10, ac);
    },

    // Recording stop
    recordStop() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sawtooth', 400, 200, t, 0.12, 0.08, ac);
    },

    // Select dropdown change
    select() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sine', 700, 900, t, 0.045, 0.09, ac);
    },

    // Modal / dialog open
    open() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sine', 400, 700, t, 0.10, 0.09, ac);
        osc('sine', 880, t + 0.08, 0.10, 0.08, ac);
    },

    // Modal / dialog close
    close() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        oscSlide('sine', 700, 350, t, 0.09, 0.08, ac);
    },

    // Export complete — satisfying resolution chord
    complete() {
        if (muted()) return;
        const ac = ctx();
        const t = ac.currentTime;
        osc('sine', 523,  t,        0.30, 0.12, ac); // C5
        osc('sine', 659,  t + 0.08, 0.28, 0.12, ac); // E5
        osc('sine', 784,  t + 0.16, 0.26, 0.12, ac); // G5
        osc('sine', 1047, t + 0.24, 0.40, 0.10, ac); // C6
    },
};
