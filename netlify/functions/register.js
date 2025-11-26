const bcrypt = require('bcryptjs');

// Foydalanuvchilar bazasi (xotirada saqlanadi - production da database kerak)
const users = [];

// Email validatsiya
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const { username, email, password } = JSON.parse(event.body);

        // Input validatsiya
        if (!username || !email || !password) {
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

        // Email validatsiya
        if (!validateEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Email noto\'g\'ri formatda'
                })
            };
        }

        // Parol validatsiya
        if (password.length < 8) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Parol kamida 8 belgidan iborat bo\'lishi kerak'
                })
            };
        }

        // SQL Injection himoyasi
        const sanitizedUsername = username.replace(/['";\\<>]/g, '');
        const sanitizedEmail = email.replace(/['";\\<>]/g, '');

        // Foydalanuvchi mavjudligini tekshirish
        // Production da database dan tekshiriladi
        // Hozircha faqat success qaytaramiz

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yangi foydalanuvchi (production da database ga saqlanadi)
        const newUser = {
            id: Date.now(),
            username: sanitizedUsername,
            email: sanitizedEmail,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        console.log('Yangi foydalanuvchi ro\'yxatdan o\'tdi:', sanitizedUsername);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            })
        };

    } catch (error) {
        console.error('Register xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};
