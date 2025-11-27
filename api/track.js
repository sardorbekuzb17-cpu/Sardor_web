import clientPromise from './_mongodb.js';

// Joylashuvni aniqlash (to'liq ma'lumotlar bilan)
async function getLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        return {
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            countryCode: data.country_code || 'Unknown',
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            coordinates: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : null,
            timezone: data.timezone || 'Unknown',
            isp: data.org || 'Unknown',
            full: data.city && data.country_name ? `${data.city}, ${data.region}, ${data.country_name}` : (data.country_name || 'Unknown')
        };
    } catch (error) {
        console.error('Location error:', error);
        return {
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            countryCode: 'Unknown',
            latitude: null,
            longitude: null,
            coordinates: null,
            timezone: 'Unknown',
            isp: 'Unknown',
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

        // Tashrif ma'lumotlarini saqlash (to'liq ma'lumotlar)
        const visitor = {
            sessionId: sessionId,
            ip: clientIp,
            device: visitorData.device,
            deviceIcon: visitorData.deviceIcon,
            browser: visitorData.browser,
            os: visitorData.os,
            page: visitorData.page,
            referrer: visitorData.referrer,
            screenWidth: visitorData.screenWidth,
            screenHeight: visitorData.screenHeight,
            language: visitorData.language,
            location: location.full,
            country: location.country,
            countryCode: location.countryCode,
            city: location.city,
            region: location.region,
            coordinates: location.coordinates,
            latitude: location.latitude,
            longitude: location.longitude,
            timezone: location.timezone,
            isp: location.isp,
            timestamp: new Date(),
            lastSeen: new Date(),
            active: true,
            userName: 'Mehmon', // Keyinchalik login qilgan foydalanuvchi uchun yangilanadi
            visitHistory: [{
                page: visitorData.page,
                timestamp: new Date()
            }]
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
