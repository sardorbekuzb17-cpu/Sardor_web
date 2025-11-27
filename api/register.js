import bcrypt from 'bcryptjs';
import clientPromise from './_mongodb.js';

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

        // MongoDB ga ulanish
        const client = await clientPromise;
        const db = client.db('loginSystem');
        const usersCollection = db.collection('users');

        // Foydalanuvchi mavjudligini tekshirish
        const existingUser = await usersCollection.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu foydalanuvchi nomi yoki email allaqachon band'
            });
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yangi foydalanuvchi
        const newUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        console.log('Yangi foydalanuvchi ro\'yxatdan o\'tdi:', username);

        return res.status(200).json({
            success: true,
            message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
            user: {
                id: result.insertedId,
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
