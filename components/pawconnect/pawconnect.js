(function () {
  'use strict';

  const CHAT_API = window.PAWCONNECT_API || 'http://localhost:3000/chat';

  const scriptEl = document.currentScript;
  const basePath = scriptEl
    ? scriptEl.src.replace(/pawconnect\.js(\?.*)?$/, '')
    : './components/pawconnect/';

  if (!document.querySelector('link[href*="pawconnect.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'pawconnect.css';
    document.head.appendChild(link);
  }

  if (!document.getElementById('paw-launcher')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
<button id="paw-launcher" aria-label="Open PawConnect AI chat">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm15 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM7 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm10 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM12 22c-4 0-8-2.5-8-7 0-3.5 2.5-6 6-6.5.6-.1 1.3-.1 2 0 3.5.5 6 3 6 6.5 0 4.5-4 7-6 7z"/>
  </svg>
  <span class="badge" id="launcher-badge"></span>
</button>

<div id="paw-window" role="dialog" aria-label="PawConnect AI Chat">
  <div class="pw-header">
    <div class="pw-avatar">🐾</div>
    <div class="pw-header-text">
      <h2>PawConnect AI</h2>
      <div class="pw-status">
        <span class="pw-dot"></span>
        <p>Online · Wildlife & Pet Assistant</p>
      </div>
    </div>
    <button class="pw-close" aria-label="Close chat">✕</button>
  </div>

  <div class="pw-messages" id="pw-messages"></div>
  <div class="quick-replies" id="quick-replies"></div>

  <div class="pw-input-bar">
    <textarea id="pw-input" placeholder="Ask about animals, rescue, or pet care…" rows="1"></textarea>
    <button class="pw-send" id="pw-send" aria-label="Send message">
      <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
  </div>

  <div class="pw-footer"></div>
</div>`
    );
  }

  let chatHistory = [];
  let isTyping = false;
  let isOpen = false;

  const launcher = document.getElementById('paw-launcher');
  const pawWindow = document.getElementById('paw-window');
  const badge = document.getElementById('launcher-badge');
  const messagesEl = document.getElementById('pw-messages');
  const quickRepliesEl = document.getElementById('quick-replies');
  const inputEl = document.getElementById('pw-input');
  const sendBtn = document.getElementById('pw-send');
  const closeBtn = pawWindow.querySelector('.pw-close');

  function toggleChat() {
    isOpen = !isOpen;
    pawWindow.classList.toggle('open', isOpen);
    badge.classList.remove('show');
    if (isOpen && chatHistory.length === 0) {
      setTimeout(showWelcome, 300);
    }
    if (isOpen) {
      setTimeout(() => inputEl.focus(), 350);
    }
  }

  function showWelcome() {
    addBotMessage(
      "Hi there! 🐾 I'm **PawConnect AI**, your animal welfare and wildlife assistant!\n\nI can help you with:\n🦁 Wildlife & conservation questions\n🐕 Pet adoption and care tips\n🚑 Rescue guidance for injured animals\n🌿 Endangered species info\n\nHow can I help you today?"
    );
    showQuickReplies([
      '🐦 Found an injured bird',
      '🐶 I want to adopt a dog',
      '🐯 Why are tigers endangered?',
      '🐍 I found a snake at home',
    ]);
  }

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `
    <div class="msg-avatar">🐾</div>
    <div>
      <div class="msg-bubble">${markdownToHtml(text)}</div>
      <div class="msg-time">${getTime()}</div>
    </div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `
    <div class="msg-avatar">👤</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${getTime()}</div>
    </div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typing-indicator';
    div.innerHTML = `
    <div class="msg-avatar">🐾</div>
    <div class="msg-bubble" style="padding:12px 16px;">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  function showQuickReplies(options) {
    quickRepliesEl.innerHTML = '';
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = opt;
      btn.onclick = () => {
        quickRepliesEl.innerHTML = '';
        processUserInput(opt);
      };
      quickRepliesEl.appendChild(btn);
    });
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isTyping) return;
    inputEl.value = '';
    autoResize(inputEl);
    quickRepliesEl.innerHTML = '';
    processUserInput(text);
  }

  async function processUserInput(text) {
    addUserMessage(text);
    chatHistory.push({ role: 'user', content: text });

    isTyping = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response from the server.');
      }

      const reply =
        data.reply ||
        "I'm sorry, I couldn't process that. Please try again! 🐾";

      removeTyping();
      addBotMessage(reply);
      chatHistory.push({ role: 'assistant', content: reply });

      const lower = text.toLowerCase();
      if (lower.includes('adopt') || lower.includes('dog') || lower.includes('cat')) {
        showQuickReplies([
          '🏠 What size dog suits me?',
          '🐱 Tell me about cat care',
          '📋 Adoption checklist',
        ]);
      } else if (
        lower.includes('bird') ||
        lower.includes('animal') ||
        lower.includes('found') ||
        lower.includes('injured')
      ) {
        showQuickReplies([
          '📞 Find a rescue center',
          '🚑 Emergency first steps',
          '🐦 Baby bird guide',
        ]);
      } else if (
        lower.includes('tiger') ||
        lower.includes('endanger') ||
        lower.includes('wildlife')
      ) {
        showQuickReplies([
          '🐘 Other endangered species',
          '🌿 How to help conservation',
          '🦁 African wildlife',
        ]);
      }
    } catch (err) {
      removeTyping();
      addBotMessage(
        'Oops! I had trouble connecting right now 🐾 Please check your connection and try again. If an animal is in immediate danger, please contact your local wildlife rescue center directly!'
      );
      console.error('PawConnect chat error:', err.message);
    }

    isTyping = false;
    sendBtn.disabled = false;
    inputEl.focus();

    if (!isOpen) {
      badge.classList.add('show');
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function markdownToHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  launcher.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', handleKey);
  inputEl.addEventListener('input', () => autoResize(inputEl));
})();
