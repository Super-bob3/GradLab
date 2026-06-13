/**
 * feedback.js — Feedback widget (Discord webhook)
 * 替换 WEBHOOK_URL 为你的 Discord Webhook 地址。
 */

import { sound } from './sound.js';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1513490047725469856/pHCVTu4HgvycbrORgpTBUPemcqate5hw-tkq_u0VMe_21ek6jyUsQZE77gcuAwfnp08g';

const TOPICS = [
  { value: 'bug',     label: 'Bug Report',      color: 0xe53e3e },
  { value: 'feature', label: 'Feature Request',  color: 0x30A46C },
  { value: 'general', label: 'General Feedback', color: 0x5865F2 },
];

export function initFeedback() {
  const btn        = document.getElementById('btn-feedback');
  const popover    = document.getElementById('feedback-popover');
  if (!btn || !popover) return;

  const topicSel    = document.getElementById('ctrl-feedback-topic');
  const textarea    = popover.querySelector('#feedback-text');
  const sendBtn     = popover.querySelector('#feedback-send');
  const normalView  = popover.querySelector('.feedback-normal');
  const successView = popover.querySelector('.feedback-success');

  let isOpen = false;

  function openPopover() {
    const rect = btn.getBoundingClientRect();
    popover.style.top   = (rect.bottom + 6) + 'px';
    popover.style.right = (window.innerWidth - rect.right) + 'px';
    popover.classList.add('open');
    btn.classList.add('active');
    isOpen = true;
    sound.open();
  }

  function closePopover() {
    popover.classList.remove('open');
    btn.classList.remove('active');
    isOpen = false;
    sound.close();
  }

  function updateSendBtn() {
    sendBtn.disabled = !textarea.value.trim() || !topicSel.value;
  }

  function resetForm() {
    topicSel.value      = '';
    topicSel.dispatchEvent(new Event('change'));
    textarea.value      = '';
    sendBtn.disabled    = true;
    sendBtn.textContent = 'Send';
    normalView.hidden   = false;
    successView.hidden  = true;
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    isOpen ? closePopover() : openPopover();
  });

  document.addEventListener('click', e => {
    if (isOpen && !popover.contains(e.target) && e.target !== btn) closePopover();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closePopover();
  });

  textarea.addEventListener('focus', () => sound.tap());
  textarea.addEventListener('input', updateSendBtn);
  topicSel.addEventListener('change', () => {
    updateSendBtn();
    textarea.focus();
  });

  sendBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) return;

    const topic = TOPICS.find(t => t.value === topicSel.value) ?? TOPICS[2];

    sendBtn.disabled    = true;
    sendBtn.textContent = 'Sending…';

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title:       topic.label,
            description: text,
            color:       topic.color,
            footer: {
              text: `GradLab · ${navigator.language} · ${window.innerWidth}×${window.innerHeight}`,
            },
            timestamp: new Date().toISOString(),
          }],
        }),
      });

      if (!res.ok) throw new Error(res.status);

      normalView.hidden  = true;
      successView.hidden = false;
      sound.confirm();
      setTimeout(() => {
        closePopover();
        setTimeout(resetForm, 350);
      }, 2000);
    } catch {
      sendBtn.disabled    = false;
      sendBtn.textContent = 'Send';
    }
  });
}
