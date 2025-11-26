// Xavfsizlik sozlamalari
const SECURITY_CONFIG = {
    MIN_PASSWORD_LENGTH: 8,
    MIN_USERNAME_LENGTH: 3
};

// DOM elementlari
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');

// XSS himoyasi
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// SQL Injection himoyasi
function preventSQLInjection(input) {
    const dangerous = /['";\\<>]/g;
    return input.replace(dangerous, '');
}

// Parolni ko'rsatish/yashirish
togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    confirmPasswordInput.type = type;
    this.style.transform = type === 'text' ? 'scale(1.1) rotate(180deg)' : 'scale(1)';
});

// Xato xabarini ko'rsatish
function showError(message) {
    errorMessage.textContent = message;
    successMessage.textContent = '';
    errorMessage.style.animation = 'none';
    setTimeout(() => {
        errorMessage.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Muvaffaqiyat xabarini ko'rsatish
function showSuccess(message) {
    successMessage.textContent = message;
    errorMessage.textContent = '';
    successMessage.style.animation = 'none';
    setTimeout(() => {
        successMessage.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

// Xabarlarni tozalash
function clearMessages() {
    errorMessage.textContent = '';
    successMessage.textContent = '';
}

// Email validatsiya
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
        return 'Parol katta harf, kichik harf, raqam va maxsus belgidan iborat bo\'lishi kerak';
    }

    return null;
}

// Input maydonlarida maxsus belgilarni cheklash
usernameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^a-zA-Z0-9_-]/g, '');
});

// Form yuborish
registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearMessages();

    // Inputlarni olish va tozalash
    let username = sanitizeInput(usernameInput.value.trim());
    let email = sanitizeInput(emailInput.value.trim());
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    // SQL Injection himoyasi
    username = preventSQLInjection(username);
    email = preventSQLInjection(email);

    // Validatsiya
    if (!username || !email || !password || !confirmPassword) {
        showError('Barcha maydonlarni to\'ldiring');
        return;
    }

    if (username.length < SECURITY_CONFIG.MIN_USERNAME_LENGTH || username.length > 50) {
        showError('Foydalanuvchi nomi 3-50 belgi orasida bo\'lishi kerak');
        return;
    }

    if (!validateEmail(email)) {
        showError('Email noto\'g\'ri formatda');
        return;
    }

    // Parol kuchliligini tekshirish
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(passwordError);
        return;
    }

    // Parollarni solishtirish
    if (password !== confirmPassword) {
        showError('Parollar mos kelmadi');
        return;
    }

    // Loading holatini yoqish
    submitBtn.classList.add('loading');

    try {
        // Backend API ga so'rov yuborish
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Muvaffaqiyatli ro'yxatdan o'tish
            showSuccess('Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Login sahifasiga yo\'naltirilmoqda...');

            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            showError(data.message || 'Ro\'yxatdan o\'tishda xatolik');
            submitBtn.classList.remove('loading');
        }
    } catch (error) {
        console.error('Register xatosi:', error);
        showError('Server bilan bog\'lanishda xatolik. Qayta urinib ko\'ring.');
        submitBtn.classList.remove('loading');
    }
});

// Right-click va context menu ni o'chirish
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// F12 va boshqa klaviatura kombinatsiyalarini bloklash
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
});
