const bcrypt = require('bcryptjs');

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

// Joylashuvni aniqlash (IP orqali)
async function getLocation(ip) {
    try {
        // ipapi.co dan foydalanish (bepul)
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (data.city && data.country_name) {
            return `${data.city}, ${data.country_name}`;
        }
        return data.country_name || 'Unknown';
    } catch (error) {
        console.error('Location xatosi:', error);
        return 'Unknown';
    }
}

// Foydalanuvchilar bazasi
const users = [
    {
        id: 1,
        username: 'Sardor',
        password: '$2a$10$OHB0J/PkXacy2oE9qcdNUuIb3Xo000bche13.IQXKuFy7E1YRIsl.',
        email: 'sardor@example.com'
    }
];

// Cookie dan ma'lumot olish
function getCookie(cookieString, name) {
    if (!cookieString) return null;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

// Rate limiting uchun
const loginAttempts = new Map();

exports.handler = async (event, context) => {
    // Faqat POST so'rovlarni qabul qilish
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);
        const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'];

        // Rate limiting
        const attempts = loginAttempts.get(clientIp) || { count: 0, timestamp: Date.now() };
        if (attempts.count >= 5 && Date.now() - attempts.timestamp < 900000) {
            return {
                statusCode: 429,
                body: JSON.stringify({
                    success: false,
                    message: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.'
                })
            };
        }

        // Input validatsiya
        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Barcha maydonlarni to\'ldiring'
                })
            };
        }

        // Username validatsiya
        if (username.length < 3 || username.length > 50) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Foydalanuvchi nomi 3-50 belgi orasida bo\'lishi kerak'
                })
            };
        }

        // SQL Injection himoyasi
        const sanitizedUsername = username.replace(/['";\\<>]/g, '');

        // Foydalanuvchini topish
        const user = users.find(u => u.username === sanitizedUsername);

        if (!user) {
            loginAttempts.set(clientIp, { count: attempts.count + 1, timestamp: Date.now() });
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
                })
            };
        }

        // Parolni tekshirish
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            loginAttempts.set(clientIp, { count: attempts.count + 1, timestamp: Date.now() });
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
                })
            };
        }

        // Muvaffaqiyatli login
        loginAttempts.delete(clientIp);

        // Qurilma va joylashuv ma'lumotlarini olish
        const userAgent = event.headers['user-agent'] || '';
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
        console.log('Login log:', loginLog);

        // Session token yaratish
        const sessionToken = Date.now().toString(36) + Math.random().toString(36);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`,
                'Set-Cookie': `userId=${user.id}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`,
                'Set-Cookie': `username=${user.username}; Path=/; Secure; SameSite=Strict; Max-Age=1800`
            },
            body: JSON.stringify({
                success: true,
                message: 'Muvaffaqiyatli kirdingiz',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            })
        };

    } catch (error) {
        console.error('Login xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};
