import bcrypt from 'bcryptjs';
import clientPromise from '../lib/mongodb.js';

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
        const { username, password } = req.body;

        // Input validatsiya
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Barcha maydonlarni to\'ldiring'
            });
        }

        // MongoDB ga ulanish
        const client = await clientPromise;
        const db = client.db('loginSystem');
        const usersCollection = db.collection('users');

        // Foydalanuvchini topish
        const user = await usersCollection.findOne({ username: username });

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

        // Login logini saqlash
        const logsCollection = db.collection('loginLogs');
        await logsCollection.insertOne({
            userId: user._id,
            username: user.username,
            timestamp: new Date(),
            ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown',
            userAgent: req.headers['user-agent'] || 'Unknown'
        });

        return res.status(200).json({
            success: true,
            message: 'Muvaffaqiyatli kirdingiz',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login xatosi:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi: ' + error.message
        });
    }
}
