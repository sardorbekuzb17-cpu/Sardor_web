const bcrypt = require('bcryptjs');

// Foydalanuvchilar bazasi
const users = [
    {
        id: 1,
        username: 'Sardor',
        password: '$2a$10$OHB0J/PkXacy2oE9qcdNUuIb3Xo000bche13.IQXKuFy7E1YRIsl.',
        email: 'sardor@example.com'
    }
];

// Login loglarini saqlash
const loginLogs = [];

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

// Joylashuvni aniqlash
async function getLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (data.city && data.country_name) {
            return `${data.city}, ${data.country_name}`;
        }
        return data.country_name || 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';

        // Input validatsiya
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Barcha maydonlarni to\'ldiring'
            });
        }

        // Foydalanuvchini topish
        const user = users.find(u => u.username === username);

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
        const location = await getLocation(clientIp);

        // Login logini saqlash
        const loginLog = {
            id: Date.now(),
            username: user.username,
            ip: clientIp,
            device: deviceInfo.device,
            deviceIcon: deviceInfo.icon,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            location: location,
            timestamp: new Date().toISOString(),
            active: true
        };

        loginLogs.push(loginLog);

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
};
