import clientPromise from '../lib/mongodb.js';

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
        const visitorsCollection = db.collection('visitors');

        // Barcha tashriflarni olish (oxirgi 100 ta)
        const visitors = await visitorsCollection
            .find({})
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // Statistika
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Mamlakatlar ro'yxati
        const countries = {};
        visitors.forEach(v => {
            const country = v.country || v.location || 'Unknown';
            countries[country] = (countries[country] || 0) + 1;
        });

        const stats = {
            total: await visitorsCollection.countDocuments({}),
            today: await visitorsCollection.countDocuments({
                timestamp: { $gte: todayStart }
            }),
            week: await visitorsCollection.countDocuments({
                timestamp: { $gte: weekStart }
            }),
            month: await visitorsCollection.countDocuments({
                timestamp: { $gte: monthStart }
            }),
            online: await visitorsCollection.countDocuments({
                active: true,
                lastSeen: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 daqiqa ichida
            }),
            countries: Object.keys(countries).length
        };

        return res.status(200).json({
            success: true,
            stats: stats,
            visitors: visitors,
            countries: countries
        });

    } catch (error) {
        console.error('Visitors xatosi:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi: ' + error.message
        });
    }
}
