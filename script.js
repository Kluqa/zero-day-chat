// Matrix Background Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = '01';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// Chat Functionality
let usedNicknames = new Set();
let currentUser = 'ANONYMOUS';

// Track active users
let activeUsers = new Set();

function updateActiveUsersCount() {
    document.getElementById('activeUsersCount').textContent = activeUsers.size;
}

function initiateChat() {
    const input = document.getElementById('nicknameInput');
    const rawNickname = input.value.trim();
    const displayName = rawNickname || 'ANONYMOUS';
    const normalized = displayName.toLowerCase();

    if (usedNicknames.has(normalized)) {
        document.getElementById('nicknameError').style.display = 'block';
        return;
    }

    usedNicknames.add(normalized);
    activeUsers.add(normalized); // Add user to active users
    currentUser = displayName;
    
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('chatContainer').classList.remove('hidden');
    document.getElementById('currentUser').textContent = currentUser;
    
    updateActiveUsersCount(); // Update active users count
    const systemMsg = createMessage(`User ${currentUser} authenticated`, 'System');
    document.getElementById('chat').appendChild(systemMsg);
}

function handleLogout() {
    const systemMsg = createMessage(`User ${currentUser} disconnected`, 'System');
    document.getElementById('chat').appendChild(systemMsg);
    
    usedNicknames.delete(currentUser.toLowerCase());
    activeUsers.delete(currentUser.toLowerCase()); // Remove user from active users
    currentUser = 'ANONYMOUS';
    
    document.getElementById('chatContainer').classList.add('hidden');
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('nicknameInput').value = '';
    document.getElementById('nicknameError').style.display = 'none';
    
    updateActiveUsersCount(); // Update active users count
}

function createMessage(content, user = currentUser) {
    const message = document.createElement('div');
    message.className = 'message';
    const timestamp = new Date().toLocaleTimeString();
    message.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span class="username" onclick="showUserPopup('${user}')">${user}:</span>
        <span class="content">${content}</span>
    `;
    return message;
}

function sendMessage() {
    const content = document.getElementById('messageInput').value.trim();
    if (content) {
        const message = createMessage(content);
        document.getElementById('chat').appendChild(message);
        document.getElementById('messageInput').value = '';
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    }
}

// User Popup Functions
function showUserPopup(username) {
    document.getElementById('popupUsername').textContent = username;
    document.getElementById('userPopup').classList.add('active');
    document.getElementById('userPopupOverlay').classList.add('active');
}

function closeUserPopup() {
    document.getElementById('userPopup').classList.remove('active');
    document.getElementById('userPopupOverlay').classList.remove('active');
}

// Event Listeners
document.getElementById('nicknameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') initiateChat();
});
document.getElementById('nicknameInput').addEventListener('input', () => {
    document.getElementById('nicknameError').style.display = 'none';
});
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
document.getElementById('userPopupOverlay').addEventListener('click', closeUserPopup);