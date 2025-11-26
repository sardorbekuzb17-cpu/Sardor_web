import bcrypt from 'bcryptjs';

// Foydalanuvchilar bazasi (global - barcha API lar uchun)
if (!global.users) {
    global.users = [
        {
            id: 1,
            username: 'Sardor',
            password: '$2a$10$OHB0J/PkXacy2oE9qcdNUuIb3Xo000bche13.IQXKuFy7E1YRIsl.',
            email: 'sardor@example.com'
        }
    ];
}

const users = global.users;

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { username, email, password } = req.body;

        // Input validatsiya
        if (!username || !email || !password) {
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

        // Email validatsiya
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email noto\'g\'ri formatda'
            });
        }

        // Parol validatsiya
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Parol kamida 8 belgidan iborat bo\'lishi kerak'
            });
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Foydalanuvchi mavjudligini tekshirish
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu foydalanuvchi nomi yoki email allaqachon band'
            });
        }

        // Yangi foydalanuvchi
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        global.users = users; // Global ga saqlash

        console.log('Yangi foydalanuvchi ro\'yxatdan o\'tdi:', username);
        console.log('Jami foydalanuvchilar:', users.length);

        return res.status(200).json({
            success: true,
            message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Register xatosi:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi: ' + error.message
        });
    }
}
