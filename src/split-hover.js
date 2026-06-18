/**
 * split-hover.js — SplitHover text effect (vanilla JS)
 *
 * Two stacked character layers; on hover, layer A slides out upward
 * and layer B slides in from below, with per-character stagger.
 *
 * Usage:
 *   splitHover(element)
 *   splitHover(element, { stagger: 30, duration: 380, ease: 'cubic-bezier(.16,1,.3,1)' })
 */

export function splitHover(el, {
    stagger  = 28,
    duration = 360,
    ease     = 'cubic-bezier(.22,1,.36,1)',
    trigger  = null,
} = {}) {
    const text = el.textContent.trim();
    el.textContent = '';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.display  = el.style.display || 'inline-flex';
    el.style.verticalAlign = 'bottom';

    // Build one layer of character spans
    function makeLayer(chars, className) {
        const layer = document.createElement('span');
        layer.className = className;
        layer.setAttribute('aria-hidden', 'true');
        layer.style.cssText = `
            display: inline-flex;
            position: ${className === 'sh-layer-b' ? 'absolute' : 'relative'};
            ${className === 'sh-layer-b' ? 'inset: 0; justify-content: center;' : ''}
            pointer-events: none;
            white-space: pre;
        `;
        chars.forEach((ch, i) => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.cssText = `
                display: inline-block;
                transform: translateY(${className === 'sh-layer-b' ? '105%' : '0'});
                transition: transform ${duration}ms ${ease};
                transition-delay: ${i * stagger}ms;
            `;
            layer.appendChild(span);
        });
        return layer;
    }

    const chars = [...text]; // unicode-safe split
    const layerA = makeLayer(chars, 'sh-layer-a');
    const layerB = makeLayer(chars, 'sh-layer-b');
    el.appendChild(layerA);
    el.appendChild(layerB);

    // Accessible label
    const srLabel = document.createElement('span');
    srLabel.textContent = text;
    srLabel.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
    el.appendChild(srLabel);

    const spansA = [...layerA.querySelectorAll('span')];
    const spansB = [...layerB.querySelectorAll('span')];

    const hitTarget = trigger || el;
    hitTarget.addEventListener('mouseenter', () => {
        spansA.forEach(s => s.style.transform = 'translateY(-105%)');
        spansB.forEach(s => s.style.transform = 'translateY(0)');
    });
    hitTarget.addEventListener('mouseleave', () => {
        spansA.forEach(s => s.style.transform = 'translateY(0)');
        spansB.forEach(s => s.style.transform = 'translateY(105%)');
    });
}

/**
 * Apply splitHover to all matching elements at once.
 * @param {string} selector  CSS selector
 * @param {object} opts      Options forwarded to splitHover()
 */
export function splitHoverAll(selector, opts) {
    document.querySelectorAll(selector).forEach(el => splitHover(el, opts));
}
