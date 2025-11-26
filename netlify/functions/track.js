// Tashriflarni saqlash (xotirada - production da database kerak)
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
                flag: data.country_code,
                full: `${data.city}, ${data.country_name}`
            };
        }
        return {
            city: 'Unknown',
            country: data.country_name || 'Unknown',
            flag: data.country_code || '🌍',
            full: data.country_name || 'Unknown'
        };
    } catch (error) {
        return {
            city: 'Unknown',
            country: 'Unknown',
            flag: '🌍',
            full: 'Unknown'
        };
    }
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const visitorData = JSON.parse(event.body);
        const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'Unknown';

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
            screenWidth: visitorData.screenWidth,
            screenHeight: visitorData.screenHeight,
            language: visitorData.language,
            timestamp: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            active: true
        };

        visitors.push(visitor);

        // Eski tashriflarni tozalash (24 soatdan eski)
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const filtered = visitors.filter(v => new Date(v.timestamp).getTime() > oneDayAgo);
        visitors.length = 0;
        visitors.push(...filtered);

        console.log('Yangi tashrif:', visitor);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                sessionId: sessionId,
                message: 'Tashrif qayd qilindi'
            })
        };

    } catch (error) {
        console.error('Track xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};

// Export qilish (boshqa funksiyalar uchun)
exports.visitors = visitors;
