// Xavfsizlik sozlamalari
const SECURITY_CONFIG = {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 300000, // 5 daqiqa
    SESSION_TIMEOUT: 1800000, // 30 daqiqa
    MIN_PASSWORD_LENGTH: 8,
    CAPTCHA_LENGTH: 6
};

// Login urinishlarini kuzatish
let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
let lockoutTime = parseInt(localStorage.getItem('lockoutTime') || '0');
let currentCaptcha = '';

// DOM elementlari
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const togglePasswordBtn = document.getElementById('togglePassword');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');

// XSS himoyasi - input tozalash
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// SQL Injection himoyasi - maxsus belgilarni tozalash
function preventSQLInjection(input) {
    const dangerous = /['";\\<>]/g;
    return input.replace(dangerous, '');
}

// CAPTCHA yaratish (serverdan)
async function generateCaptcha() {
    try {
        const response = await fetch('/api/captcha');
        const data = await response.json();
        currentCaptcha = data.captcha;

        // CAPTCHA ni ko'rsatish
        captchaDisplay.innerHTML = data.captcha;
        captchaDisplay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        captchaDisplay.style.color = '#ffffff';
        captchaDisplay.style.fontSize = '28px';
        captchaDisplay.style.fontWeight = '900';
        captchaDisplay.style.animation = 'none';

        setTimeout(() => {
            captchaDisplay.style.animation = 'captchaShake 0.5s ease';
        }, 10);

        console.log('CAPTCHA yuklandi:', data.captcha);
    } catch (error) {
        console.error('CAPTCHA xatosi:', error);
        captchaDisplay.innerHTML = 'ERROR';
        showError('CAPTCHA yuklanmadi. Sahifani yangilang.');
    }
}

// Parolni ko'rsatish/yashirish
togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.style.transform = type === 'text' ? 'scale(1.1) rotate(180deg)' : 'scale(1)';
});



// Xato xabarini ko'rsatish
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.animation = 'none';
    setTimeout(() => {
        errorMessage.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Xato xabarini tozalash
function clearError() {
    errorMessage.textContent = '';
}

// Bloklanganlikni tekshirish
function checkLockout() {
    const now = Date.now();
    if (lockoutTime > now) {
        const remainingTime = Math.ceil((lockoutTime - now) / 1000);
        showError(`Tizim bloklangan. ${remainingTime} soniyadan keyin qayta urinib ko'ring.`);
        submitBtn.disabled = true;
        return true;
    } else {
        loginAttempts = 0;
        localStorage.setItem('loginAttempts', '0');
        localStorage.removeItem('lockoutTime');
        submitBtn.disabled = false;
        return false;
    }
}

// Parol kuchliligini tekshirish
function validatePassword(password) {
    if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
        return `Parol kamida ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} belgidan iborat bo'lishi kerak`;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return 'Parol katta harf, kichik harf, raqam va maxsus belgidan iborat bo'lishi kerak';
    }

    return null;
}

// Rate limiting
let lastSubmitTime = 0;
const MIN_SUBMIT_INTERVAL = 1000; // 1 soniya

// Form yuborish
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError();

    // Bloklanganlikni tekshirish
    if (checkLockout()) {
        return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
        showError('Juda tez yuborilmoqda. Biroz kuting.');
        return;
    }
    lastSubmitTime = now;

    // Inputlarni olish va tozalash
    let username = sanitizeInput(usernameInput.value.trim());
    let password = passwordInput.value;
    const captchaValue = captchaInput.value.trim();

    // SQL Injection himoyasi
    username = preventSQLInjection(username);

    // Validatsiya
    if (!username || !password) {
        showError('Barcha maydonlarni to\'ldiring');
        return;
    }

    if (username.length < 3 || username.length > 50) {
        showError('Foydalanuvchi nomi 3-50 belgi orasida bo\'lishi kerak');
        return;
    }

    // Parol kuchliligini tekshirish
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(passwordError);
        return;
    }

    // CAPTCHA tekshirish
    if (captchaValue !== currentCaptcha) {
        showError('CAPTCHA noto\'g\'ri kiritildi');
        await generateCaptcha();
        captchaInput.value = '';
        loginAttempts++;
        localStorage.setItem('loginAttempts', loginAttempts.toString());
        return;
    }

    // Loading holatini yoqish
    submitBtn.classList.add('loading');

    try {
        // Backend API ga so'rov yuborish
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Muvaffaqiyatli login
            loginAttempts = 0;
            localStorage.setItem('loginAttempts', '0');
            localStorage.removeItem('lockoutTime');

            // Dashboard ga yo'naltirish
            clearError();
            captchaDisplay.textContent = '✓ Muvaffaqiyatli!';
            captchaDisplay.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            // Noto'g'ri login
            loginAttempts++;
            localStorage.setItem('loginAttempts', loginAttempts.toString());

            if (loginAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
                lockoutTime = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION;
                localStorage.setItem('lockoutTime', lockoutTime.toString());
                showError('Juda ko\'p noto\'g\'ri urinish. Tizim bloklandi.');
                submitBtn.disabled = true;
            } else {
                showError(data.message || 'Noto\'g\'ri ma\'lumotlar');
            }

            submitBtn.classList.remove('loading');
            passwordInput.value = '';
        }
    } catch (error) {
        console.error('Login xatosi:', error);
        showError('Server bilan bog\'lanishda xatolik. Qayta urinib ko\'ring.');
        submitBtn.classList.remove('loading');
    }
});

// Session timeout tekshirish
function checkSessionTimeout() {
    const sessionStart = parseInt(localStorage.getItem('sessionStart') || '0');
    if (sessionStart && Date.now() - sessionStart > SECURITY_CONFIG.SESSION_TIMEOUT) {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionStart');
        showError('Sessiya tugadi. Qaytadan kiring.');
    }
}

// Input maydonlarida maxsus belgilarni cheklash
usernameInput.addEventListener('input', function (e) {
    // Faqat harf, raqam, _ va - ruxsat etiladi
    this.value = this.value.replace(/[^a-zA-Z0-9_-]/g, '');
});

// Copy-paste himoyasi parol maydonida
passwordInput.addEventListener('paste', function (e) {
    e.preventDefault();
    showError('Parolni nusxalash/qo\'yish taqiqlanadi');
});

// DevTools ochilishini aniqlash (qo'shimcha xavfsizlik)
let devtoolsOpen = false;
const threshold = 160;

setInterval(() => {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            console.clear();
        }
    } else {
        devtoolsOpen = false;
    }
}, 1000);

// Console xabarlarini tozalash
setInterval(() => {
    console.clear();
}, 5000);

// Sahifa yuklanganda
window.addEventListener('load', function () {
    generateCaptcha();
    checkLockout();
    checkSessionTimeout();

    // Auto-logout timer
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (localStorage.getItem('sessionToken')) {
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('sessionStart');
                showError('Faollik yo\'qligi sababli tizimdan chiqdingiz');
            }
        }, SECURITY_CONFIG.SESSION_TIMEOUT);
    }

    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();
});

// Right-click va context menu ni o'chirish
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// F12 va boshqa klaviatura kombinatsiyalarini bloklash
document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    // Ctrl+U
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
});
