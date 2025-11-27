import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI topilmadi! .env.local faylini tekshiring.');
    process.exit(1);
}

async function initDatabase() {
    console.log('🔄 MongoDB ga ulanmoqda...');

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ MongoDB ga ulandi!');

        const db = client.db('loginSystem');

        // Users collection
        const usersCollection = db.collection('users');

        // Default foydalanuvchini tekshirish
        const existingUser = await usersCollection.findOne({ username: 'Sardor' });

        if (!existingUser) {
            // Default foydalanuvchi yaratish
            const hashedPassword = await bcrypt.hash('Sardor_developer', 10);

            await usersCollection.insertOne({
                username: 'Sardor',
                email: 'sardor@example.com',
                password: hashedPassword,
                createdAt: new Date()
            });

            console.log('✅ Default foydalanuvchi yaratildi:');
            console.log('   Username: Sardor');
            console.log('   Parol: Sardor_developer');
        } else {
            console.log('ℹ️  Default foydalanuvchi allaqachon mavjud');
        }

        // Index yaratish
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        console.log('✅ Users collection indexlari yaratildi');

        // Login logs collection
        const logsCollection = db.collection('loginLogs');
        await logsCollection.createIndex({ timestamp: -1 });
        await logsCollection.createIndex({ username: 1 });
        console.log('✅ Login logs collection indexlari yaratildi');

        // Visitors collection
        const visitorsCollection = db.collection('visitors');
        await visitorsCollection.createIndex({ timestamp: -1 });
        await visitorsCollection.createIndex({ sessionId: 1 }, { unique: true });
        await visitorsCollection.createIndex({ active: 1 });
        console.log('✅ Visitors collection indexlari yaratildi');

        console.log('\n🎉 Database muvaffaqiyatli sozlandi!');

    } catch (error) {
        console.error('❌ Xatolik:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔒 MongoDB ulanishi yopildi');
    }
}

initDatabase();
