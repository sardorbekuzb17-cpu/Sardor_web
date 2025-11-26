// Tashriflarni saqlash
const visitors = [];

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

module.exports = async (req, res) => {
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

        // Tashrif ma'lumotlarini saqlash
        const visitor = {
            id: sessionId,
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
            timestamp: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            active: true
        };

        visitors.push(visitor);

        res.json({
            success: true,
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Track xatosi:', error);
        res.status(500).json({
            success: false
        });
    }
};
