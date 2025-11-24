// DOM Elements
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggleBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthSection = document.getElementById('strengthSection');
const emptyState = document.getElementById('emptyState');
const successMessage = document.getElementById('successMessage');
const progressBar = document.getElementById('progressBar');
const strengthText = document.getElementById('strengthText');
const strengthIcon = document.getElementById('strengthIcon');
const tipsSection = document.getElementById('tipsSection');
const requirementElements = document.querySelectorAll('.requirement');
const dots = document.querySelectorAll('.dot');
const charCount = document.getElementById('charCount');
const charCountSpan = document.querySelector('.char-count');
const toast = document.getElementById('toast');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Generator elements
const generatedPasswordInput = document.getElementById('generatedPassword');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const copyGeneratedBtn = document.getElementById('copyGeneratedBtn');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');

// History elements
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// State
let passwordHistory = [];

// ============== TAB NAVIGATION ==============
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active to clicked tab
        btn.classList.add('active');
        document.getElementById(tabName + '-tab').classList.add('active');
    });
});

// ============== PASSWORD CHECKER ==============
passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    charCount.textContent = password.length;
    
    if (password === '') {
        resetUI();
        return;
    }

    const strength = calculateStrength(password);
    updateUI(strength);
    updateCharAnalysis(password);
});

toggleBtn.addEventListener('click', () => {
    const isPasswordType = passwordInput.type === 'password';
    passwordInput.type = isPasswordType ? 'text' : 'password';
    toggleBtn.innerHTML = isPasswordType 
        ? '<i class="fas fa-eye-slash"></i>' 
        : '<i class="fas fa-eye"></i>';
});

copyBtn.addEventListener('click', () => {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        showToast('Password copied to clipboard!');
    }
});

function calculateStrength(password) {
    let score = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    Object.values(requirements).forEach(req => {
        if (req) score++;
    });

    const crackTime = estimateCrackTime(password);

    return {
        score,
        requirements,
        level: getLevel(score),
        color: getColor(score),
        icon: getIcon(score),
        tip: getTip(score),
        crackTime
    };
}

function estimateCrackTime(password) {
    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSpecial) charsetSize += 32;

    const combinations = Math.pow(charsetSize, length);
    const guessesPerSecond = 1e9; // 1 billion guesses per second
    const seconds = combinations / 2 / guessesPerSecond;

    if (seconds < 1) return 'Instant';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 2592000) return Math.round(seconds / 86400) + ' days';
    if (seconds < 31536000) return Math.round(seconds / 2592000) + ' months';
    return 'Centuries';
}

function getLevel(score) {
    const levels = ['None', 'Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong'];
    return levels[score];
}

function getColor(score) {
    const colors = [
        { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280', text: '#d1d5db' },
        { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#fca5a5' },
        { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#fdba74' },
        { bg: 'rgba(234, 179, 8, 0.2)', border: '#eab308', text: '#fcd34d' },
        { bg: 'rgba(132, 204, 22, 0.2)', border: '#84cc16', text: '#d4fc79' },
        { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#86efac' }
    ];
    return colors[score];
}

function getIcon(score) {
    const icons = ['🔓', '🔓', '⚠️', '📝', '✓', '🔒'];
    return icons[score];
}

function getTip(score) {
    const tips = [
        'Start typing to create a password.',
        'Add more variety: mix uppercase, lowercase, numbers, and symbols.',
        'Make it stronger: add special characters and increase length.',
        'Getting close! Add more special characters for maximum security.',
        'Almost there! Just need one more element for perfect strength.',
        'Your password is very strong! You\'re all set.'
    ];
    return tips[score];
}

function updateUI(strength) {
    const { score, requirements, level, color, icon, tip, crackTime } = strength;

    strengthSection.classList.remove('hidden');
    emptyState.classList.add('hidden');

    const percentage = (score / 5) * 100;
    progressBar.style.width = percentage + '%';
    progressBar.style.background = score === 5 
        ? 'linear-gradient(to right, #22c55e, #10b981)'
        : 'linear-gradient(to right, #a855f7, #ec4899)';

    strengthText.textContent = level;
    strengthIcon.textContent = icon;
    strengthText.style.color = color.text;

    // Update dots
    dots.forEach((dot, index) => {
        if (index < score) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update score value
    document.getElementById('scoreValue').textContent = percentage.toFixed(0);
    document.getElementById('crackTime').textContent = crackTime;

    // Update requirements
    const reqKeys = ['length', 'uppercase', 'lowercase', 'numbers', 'special'];
    requirementElements.forEach((element, index) => {
        const key = reqKeys[index];
        if (requirements[key]) {
            element.classList.add('met');
        } else {
            element.classList.remove('met');
        }
    });

    updateTips(tip, score, color);

    if (score === 5) {
        successMessage.classList.remove('hidden');
    } else {
        successMessage.classList.add('hidden');
    }

    // Add to history
    addToHistory(passwordInput.value, level, score);
}

function updateCharAnalysis(password) {
    const upper = password.match(/[A-Z]/g) || [];
    const lower = password.match(/[a-z]/g) || [];
    const numbers = password.match(/[0-9]/g) || [];
    const symbols = password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || [];

    document.getElementById('upperCount').textContent = upper.length;
    document.getElementById('lowerCount').textContent = lower.length;
    document.getElementById('numberCount').textContent = numbers.length;
    document.getElementById('symbolCount').textContent = symbols.length;

    const maxLength = password.length || 1;
    document.querySelector('.uppercase-bar').style.width = (upper.length / maxLength) * 100 + '%';
    document.querySelector('.lowercase-bar').style.width = (lower.length / maxLength) * 100 + '%';
    document.querySelector('.number-bar').style.width = (numbers.length / maxLength) * 100 + '%';
    document.querySelector('.symbol-bar').style.width = (symbols.length / maxLength) * 100 + '%';
}

function updateTips(tip, score, color) {
    const tipClasses = ['very-weak', 'weak', 'fair', 'good', 'good'];
    const tipClass = tipClasses[score] || 'very-weak';

    tipsSection.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <p>${tip}</p>
    `;
    
    tipsSection.className = 'tips-section';
    tipsSection.classList.add(tipClass);
    tipsSection.style.borderLeftColor = color.border;
    tipsSection.style.color = color.text;
}

function resetUI() {
    strengthSection.classList.add('hidden');
    emptyState.classList.remove('hidden');
    successMessage.classList.add('hidden');
    progressBar.style.width = '0';
    dots.forEach(dot => dot.classList.remove('active'));
    requirementElements.forEach(element => element.classList.remove('met'));
}

// ============== PASSWORD GENERATOR ==============
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

generateBtn.addEventListener('click', generatePassword);
regenerateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{};\':"|,.<>?';

    let chars = '';
    if (includeUppercase.checked) chars += uppercase;
    if (includeLowercase.checked) chars += lowercase;
    if (includeNumbers.checked) chars += numbers;
    if (includeSymbols.checked) chars += symbols;

    if (chars === '') {
        showToast('Select at least one character type!', 'error');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    generatedPasswordInput.value = password;
    showToast('Password generated!');
}

copyGeneratedBtn.addEventListener('click', () => {
    if (generatedPasswordInput.value) {
        navigator.clipboard.writeText(generatedPasswordInput.value);
        showToast('Password copied!');
    }
});

// ============== HISTORY ==============
function addToHistory(password, level, score) {
    const existingIndex = passwordHistory.findIndex(item => item.password === password);
    if (existingIndex !== -1) {
        passwordHistory.splice(existingIndex, 1);
    }

    passwordHistory.unshift({ password, level, score, timestamp: new Date() });
    
    if (passwordHistory.length > 10) {
        passwordHistory = passwordHistory.slice(0, 10);
    }

    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No history yet. Check passwords to see them here.</p>';
        clearHistoryBtn.classList.add('hidden');
        return;
    }

    clearHistoryBtn.classList.remove('hidden');

    historyList.innerHTML = passwordHistory.map((item, idx) => `
        <div class="history-item" style="animation-delay: ${idx * 0.05}s">
            <div class="history-item-content">
                <div class="history-password">${maskPassword(item.password)}</div>
                <div class="history-strength">
                    <span class="history-strength-badge ${item.level.toLowerCase().replace(/\s+/g, '-')}">${item.level}</span>
                    <span>${item.score}/5</span>
                </div>
            </div>
        </div>
    `).join('');
}

function maskPassword(password) {
    if (password.length <= 4) return '*'.repeat(password.length);
    return password.substring(0, 2) + '*'.repeat(password.length - 4) + password.slice(-2);
}

clearHistoryBtn.addEventListener('click', () => {
    passwordHistory = [];
    updateHistoryDisplay();
    showToast('History cleared!');
});

// ============== TOAST NOTIFICATION ==============
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initial setup
resetUI();
updateHistoryDisplay();