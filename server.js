const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Xavfsizlik middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session sozlamalari
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // production da true qiling (HTTPS uchun)
        httpOnly: true,
        maxAge: 1800000, // 30 daqiqa
        sameSite: 'strict'
    }
}));

// Rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 daqiqa
    max: 5, // maksimal 5 ta urinish
    message: { success: false, message: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Foydalanuvchilar bazasi (demo uchun - real loyihada database ishlatiladi)
const users = [
    {
        id: 1,
        username: 'Sardor',
        // Parol: Sardor_developer
        password: '$2a$10$OHB0J/PkXacy2oE9qcdNUuIb3Xo000bche13.IQXKuFy7E1YRIsl.',
        email: 'sardor@example.com'
    }
];



// Login endpoint
app.post('/api/login', loginLimiter, async (req, res) => {
    try {
        const { username, password, captcha } = req.body;

        // Input validatsiya
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Barcha maydonlarni to\'ldiring'
            });
        }

        // Username validatsiya
        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Foydalanuvchi nomi 3-50 belgi orasida bo\'lishi kerak'
            });
        }

        // SQL Injection himoyasi
        const sanitizedUsername = username.replace(/['";\\<>]/g, '');

        // Foydalanuvchini topish
        const user = users.find(u => u.username === sanitizedUsername);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
            });
        }

        // Parolni tekshirish
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
            });
        }

        // Session yaratish
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.loginTime = Date.now();

        res.json({
            success: true,
            message: 'Muvaffaqiyatli kirdingiz',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login xatosi:', error);
        res.status(500).json({
            success: false,
            message: 'Server xatosi'
        });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Chiqishda xatolik'
            });
        }
        res.json({
            success: true,
            message: 'Muvaffaqiyatli chiqdingiz'
        });
    });
});

// Session tekshirish
app.get('/api/check-session', (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username
            }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
});

// Yangi foydalanuvchi qo'shish (demo uchun)
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validatsiya
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Barcha maydonlarni to\'ldiring'
            });
        }

        // Foydalanuvchi mavjudligini tekshirish
        if (users.find(u => u.username === username)) {
            return res.status(400).json({
                success: false,
                message: 'Bu foydalanuvchi nomi band'
            });
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yangi foydalanuvchi
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            email
        };

        users.push(newUser);

        res.json({
            success: true,
            message: 'Ro\'yxatdan o\'tdingiz'
        });

    } catch (error) {
        console.error('Ro\'yxatdan o\'tish xatosi:', error);
        res.status(500).json({
            success: false,
            message: 'Server xatosi'
        });
    }
});



// Dashboard sahifasi (himoyalangan)
app.get('/dashboard.html', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Server ishga tushirish
app.listen(PORT, () => {
    console.log(`\n🚀 Server ishga tushdi!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`\n📝 Login ma'lumotlari:`);
    console.log(`   Username: Sardor`);
    console.log(`   Parol: Sardor_developer`);
    console.log(`\n⏰ Server 24/7 ishlaydi. To'xtatish uchun Ctrl+C bosing.\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal qabul qilindi. Server yopilmoqda...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nServer to\'xtatildi.');
    process.exit(0);
});
