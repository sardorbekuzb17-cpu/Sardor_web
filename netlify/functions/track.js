import clientPromise from '../lib/mongodb.js';

// Joylashuvni aniqlash
async function getLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (data.city && data.country_name) {
            return {
                city: data.city,
                country: data.country_name,
                full: `${data.city}, ${data.country_name}`
            };
        }
        return {
            city: 'Unknown',
            country: data.country_name || 'Unknown',
            full: data.country_name || 'Unknown'
        };
    } catch (error) {
        return {
            city: 'Unknown',
            country: 'Unknown',
            full: 'Unknown'
        };
    }
}

export default async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false });
    }

    try {
        const visitorData = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';

        // Joylashuvni aniqlash
        const location = await getLocation(clientIp);

        // Session ID yaratish
        const sessionId = Date.now().toString(36) + Math.random().toString(36);

        // MongoDB ga ulanish
        const client = await clientPromise;
        const db = client.db('loginSystem');
        const visitorsCollection = db.collection('visitors');

        // Tashrif ma'lumotlarini saqlash
        const visitor = {
            sessionId: sessionId,
            ip: clientIp,
            device: visitorData.device,
            deviceIcon: visitorData.deviceIcon,
            browser: visitorData.browser,
            os: visitorData.os,
            page: visitorData.page,
            referrer: visitorData.referrer,
            location: location.full,
            country: location.country,
            city: location.city,
            timestamp: new Date(),
            lastSeen: new Date(),
            active: true
        };

        await visitorsCollection.insertOne(visitor);

        res.json({
            success: true,
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Track xatosi:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
