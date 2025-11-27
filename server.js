import express from 'express';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Production da environment variables avtomatik yuklanadi
// Local development uchun dotenv
if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.default.config({ path: '.env.local' });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB ni import qilish
import clientPromise from './lib/mongodb.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Login loglarini saqlash (xotirada - production da database kerak)
const loginLogs = [];

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

        // Qurilma va joylashuv ma'lumotlarini olish
        const userAgent = req.headers['user-agent'] || '';
        const deviceInfo = getDeviceInfo(userAgent);
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';

        // Login logini saqlash
        const loginLog = {
            id: Date.now(),
            username: user.username,
            ip: clientIp,
            device: deviceInfo.device,
            deviceIcon: deviceInfo.icon,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            location: 'Local', // Local server uchun
            timestamp: new Date().toISOString(),
            active: true
        };

        loginLogs.push(loginLog);
        console.log('Login log:', loginLog);

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

// Ro'yxatdan o'tish endpoint
app.post('/api/register', loginLimiter, async (req, res) => {
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

// Qurilma ma'lumotlarini aniqlash
function getDeviceInfo(userAgent) {
    const ua = userAgent.toLowerCase();

    let device = 'Desktop';
    let icon = '💻';

    if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
        device = 'Mobile';
        icon = '📱';
        if (/ipad/.test(ua)) {
            device = 'Tablet';
            icon = '📱';
        }
    } else if (/tablet/.test(ua)) {
        device = 'Tablet';
        icon = '📱';
    }

    let browser = 'Unknown';
    if (/chrome/.test(ua) && !/edge/.test(ua)) browser = 'Chrome';
    else if (/firefox/.test(ua)) browser = 'Firefox';
    else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Safari';
    else if (/edge/.test(ua)) browser = 'Edge';
    else if (/opera|opr/.test(ua)) browser = 'Opera';

    let os = 'Unknown';
    if (/windows/.test(ua)) os = 'Windows';
    else if (/mac/.test(ua)) os = 'MacOS';
    else if (/linux/.test(ua)) os = 'Linux';
    else if (/android/.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';

    return { device, icon, browser, os };
}

// Loglarni olish API
app.get('/api/logs', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Avtorizatsiya talab qilinadi'
        });
    }

    // Statistika
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats = {
        total: loginLogs.length,
        today: loginLogs.filter(log => new Date(log.timestamp) >= todayStart).length,
        active: loginLogs.filter(log => log.active).length,
        devices: new Set(loginLogs.map(log => log.device)).size
    };

    res.json({
        success: true,
        stats: stats,
        logs: loginLogs.slice(-50).reverse()
    });
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
