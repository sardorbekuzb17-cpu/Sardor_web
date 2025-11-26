// Tashriflar ro'yxati (track.js dan import qilinadi)
let visitors = [];

exports.handler = async (event, context) => {
    try {
        // Aktiv tashriflarni yangilash (5 daqiqadan eski bo'lsa offline)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        visitors.forEach(v => {
            if (new Date(v.lastSeen).getTime() < fiveMinutesAgo) {
                v.active = false;
            }
        });

        // Statistika
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const stats = {
            online: visitors.filter(v => v.active).length,
            today: visitors.filter(v => new Date(v.timestamp) >= todayStart).length,
            total: visitors.length,
            countries: new Set(visitors.map(v => v.country)).size
        };

        // Mamlakatlar bo'yicha
        const countries = {};
        visitors.forEach(v => {
            countries[v.country] = (countries[v.country] || 0) + 1;
        });

        // Oxirgi 50 ta tashrif
        const recentVisitors = visitors.slice(-50).reverse();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                stats: stats,
                visitors: recentVisitors,
                countries: countries
            })
        };

    } catch (error) {
        console.error('Visitors xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};

// Visitors arrayni export qilish
exports.visitors = visitors;
