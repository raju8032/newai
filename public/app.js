const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const welcome = document.getElementById('welcome');
const errorToast = document.getElementById('errorToast');

let conversationHistory = [];

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

function showError(msg) {
  errorToast.textContent = msg;
  errorToast.classList.add('visible');
  setTimeout(() => errorToast.classList.remove('visible'), 4000);
}

function addMessage(role, content) {
  if (welcome) welcome.remove();

  const div = document.createElement('div');
  div.className = `message ${role === 'user' ? 'you' : 'them'}`;

  const row = document.createElement('div');
  row.className = 'message-row';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '💕';

  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${role === 'user' ? 'bubble-you' : 'bubble-them'}`;
  bubble.textContent = content;

  if (role === 'them') {
    row.appendChild(avatar);
  }
  row.appendChild(bubble);
  if (role === 'user') {
    row.appendChild(avatar);
  }

  const time = document.createElement('span');
  time.className = 'time-stamp';
  time.textContent = 'Now';

  div.appendChild(row);
  div.appendChild(time);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="message-avatar">💕</div>
    <div class="typing-bubble">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  messageInput.value = '';

  addMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });

  sendBtn.disabled = true;
  addTypingIndicator();

  try {
    const apiUrl = (typeof API_CONFIG !== 'undefined' && API_CONFIG.baseURL) 
      ? `${API_CONFIG.baseURL}/api/chat` 
      : '/api/chat';
    
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    removeTypingIndicator();
    addMessage('them', data.message);
    conversationHistory.push({ role: 'assistant', content: data.message });
  } catch (err) {
    removeTypingIndicator();
    showError(err.message || 'Failed to get a response. Check your API key and try again.');
  } finally {
    sendBtn.disabled = false;
  }
});
