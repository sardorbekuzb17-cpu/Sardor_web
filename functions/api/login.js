export async function onRequest(context) {
    const { request, env } = context;

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { username, password } = await request.json();

        // Input validatsiya
        if (!username || !password) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Barcha maydonlarni to\'ldiring'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // MongoDB ga ulanish
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(env.MONGODB_URI);
        await client.connect();

        const db = client.db('loginSystem');
        const usersCollection = db.collection('users');

        // Foydalanuvchini topish
        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            await client.close();
            return new Response(JSON.stringify({
                success: false,
                message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parolni tekshirish
        const bcrypt = await import('bcryptjs');
        const isValidPassword = await bcrypt.default.compare(password, user.password);

        if (!isValidPassword) {
            await client.close();
            return new Response(JSON.stringify({
                success: false,
                message: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await client.close();

        return new Response(JSON.stringify({
            success: true,
            message: 'Muvaffaqiyatli kirdingiz',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Server xatosi: ' + error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
