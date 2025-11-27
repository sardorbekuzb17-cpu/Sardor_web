import clientPromise from './_mongodb.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // MongoDB ga ulanish
        const client = await clientPromise;
        const db = client.db('loginSystem');
        const logsCollection = db.collection('loginLogs');

        // Barcha loglarni olish (oxirgi 100 ta)
        const logs = await logsCollection
            .find({})
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // Statistika
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const stats = {
            total: await logsCollection.countDocuments({}),
            today: await logsCollection.countDocuments({
                timestamp: { $gte: todayStart }
            }),
            uniqueUsers: (await logsCollection.distinct('username')).length
        };

        return res.status(200).json({
            success: true,
            stats: stats,
            logs: logs
        });

    } catch (error) {
        console.error('Logs xatosi:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi: ' + error.message
        });
    }
}
