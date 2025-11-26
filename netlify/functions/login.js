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
